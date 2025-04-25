"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            console.error('AuthService: Error validating user', error);
            throw new common_1.InternalServerErrorException('Error validating user');
        }
    }
    async login(user) {
        try {
            const payload = {
                sub: user.id,
                tokenVersion: user.tokenVersion,
            };
            const token = this.jwtService.sign(payload);
            user.token = token;
            await this.usersService.update(user.id, user);
            user.tokenVersion += 1;
            console.log('Generated new token:', token);
            console.log('Stored token in DB for user:', user.id);
            const { password, ...userWithoutPassword } = user;
            return {
                message: 'Signin successful',
                token,
                user: userWithoutPassword,
            };
        }
        catch (error) {
            console.error('AuthService: Error during login', error);
            throw new common_1.InternalServerErrorException('Error during login');
        }
    }
    async refreshToken(user) {
        try {
            const freshUser = await this.usersService.findOne(user.id);
            if (!freshUser) {
                console.error('AuthService: User not found during token refresh', user.id);
                throw new common_1.UnauthorizedException('User not found');
            }
            const payload = {
                sub: user.id,
                tokenVersion: user.tokenVersion
            };
            const token = this.jwtService.sign(payload);
            const { password, ...userWithoutPassword } = freshUser;
            return {
                message: 'Token refreshed successfully',
                token,
                user: userWithoutPassword,
            };
        }
        catch (error) {
            console.error('AuthService: Error during token refresh', error);
            throw new common_1.InternalServerErrorException('Error during token refresh');
        }
    }
    async logout(userId) {
        try {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            user.tokenVersion += 1;
            await this.usersService.update(userId, user);
        }
        catch (error) {
            console.error('AuthService: Error during logout', error);
            throw new common_1.InternalServerErrorException('Error during logout');
        }
    }
    async signup(createUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const newUser = await this.usersService.create({
                ...createUserDto,
                password: hashedPassword,
            });
            const { password, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        }
        catch (error) {
            console.error('AuthService: Error during signup', error);
            throw new common_1.InternalServerErrorException('Error during signup');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map