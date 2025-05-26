import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUserSchema } from '../mongodb/schemas/mongo-user.schema';
import { MongoUsersService } from '../mongodb/mongo-users.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: 'MongoUser', schema: MongoUserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'farheen'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, MongoUsersService],
  exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
