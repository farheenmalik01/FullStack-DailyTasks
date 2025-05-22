import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, NotFoundException, Req, UseInterceptors, UploadedFile, Res, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UsersService, LocalUser } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { MyStuff } from './entities/my-stuff.entity';
import { CreateMyStuffDto } from './dto/create-my-stuff.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    return this.usersService.findOne(userId);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = Number(id);
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    return this.usersService.update(userId, updateUserDto);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    return this.usersService.remove(userId);
  }

  @Post(':id/reset-token-version')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset token version for user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Token version reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetTokenVersion(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    await this.usersService.update(userId, { tokenVersion: 0 });
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tokenResponse = await this.authService.refreshToken(user);
    return {
      message: 'Token version reset successfully',
      token: tokenResponse.token,
      user: tokenResponse.user,
    };
  }

  @Get('profile')
  async getProfile(@Req() req): Promise<User | null> {
    return await this.usersService.getUser(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Req() req, @Body() body: UpdateUserDto): Promise<User | null> {
    return await this.usersService.updateUser(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/picture')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: '/usr/src/app/uploads',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      } 
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile picture updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        profilePicture: { type: 'string', description: 'URL or path to the profile picture' },
      },
    },
  })
  async uploadPicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<User | null> {
    const userId = Number(id);
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    try {
      const user = await this.usersService.updateProfilePicture(id, file.filename);
      return user;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  @Get(':id/picture')
  async getPicture(@Param('id') id: string, @Res() res: Response) {
    const userId = Number(id);
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    const user = await this.usersService.findOne(userId);
    if (!user || !user.profilePicture) {
      return res.status(404).send('Picture not found');
    }
    const picturePath = user.profilePicture.startsWith('/')
      ? user.profilePicture.substring(1)
      : user.profilePicture;
    return res.sendFile(picturePath, { root: '.' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('my-stuff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new my stuff item for the current user' })
  @ApiResponse({ status: 201, description: 'My stuff item created' })
  async createMyStuff(
    @Body() createMyStuffDto: CreateMyStuffDto,
    @Req() req,
  ) {
    const userId = req.user?.sub; 
    if (!userId) {
      throw new ForbiddenException('User not authenticated or missing user ID');
    }
    const user = await this.usersService.findOne(userId);
    if (!user || user.email !== 'freen@gmail.com') {
      throw new ForbiddenException('Access denied: unauthorized email');
    }
    
    console.log('Creating myStuff for user:', userId);
    
    return this.usersService.createMyStuff(userId, createMyStuffDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('my-stuff/all')
  @ApiBearerAuth()
  async getAllMyStuff(@Req() req) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new ForbiddenException('User not authenticated or missing user ID');
    }
    const user = await this.usersService.findOne(userId);
    if (!user || user.email !== 'freen@gmail.com') {
      throw new ForbiddenException('Access denied: unauthorized email');
    }
    return this.usersService.findMyStuff();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('my-stuff/item/:id')
  @ApiBearerAuth()
  async getMyStuffById(@Param('id') id: string, @Req() req) {
    const myStuffId = Number(id);
    if (isNaN(myStuffId) || !Number.isInteger(myStuffId) || myStuffId <= 0) {
      throw new BadRequestException(`Invalid myStuff ID: ${id}`);
    }
    const userId = req.user?.sub;
    if (!userId) {
      throw new ForbiddenException('User not authenticated or missing user ID');
    }
    const user = await this.usersService.findOne(userId);
    if (!user || user.email !== 'freen@gmail.com') {
      throw new ForbiddenException('Access denied: unauthorized email');
    }
    const myStuff = await this.usersService.findMyStuffById(myStuffId);
    if (!myStuff) {
      throw new NotFoundException('Item not found');
    }
  }
}