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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const file_handler_1 = require("./utils/file-handler");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    users = [
        { id: '1', name: 'John Doe', profilePicture: null },
    ];
    findAll() {
        return this.usersRepository.find();
    }
    findOne(id) {
        return this.usersRepository.findOneBy({ id });
    }
    findByEmail(email) {
        return this.usersRepository.findOneBy({ email });
    }
    async create(createUserDto) {
        console.log('create method called with:', createUserDto);
        if (Array.isArray(createUserDto)) {
            throw new Error('createUserDto should not be an array');
        }
        const user = this.usersRepository.create(createUserDto);
        const savedUser = await this.usersRepository.save(user);
        console.log('User created and saved in DB:', savedUser);
        try {
            console.log('Calling saveUserDataToFile in create');
            await (0, file_handler_1.saveUserDataToFile)(savedUser);
            console.log('User data saved to JSON file after create.');
        }
        catch (error) {
            console.error('Error saving user data to JSON file after create:', error);
        }
        return savedUser;
    }
    async update(id, updateUserDto) {
        console.log('update method called with id:', id, 'data:', updateUserDto);
        await this.usersRepository.update(id, updateUserDto);
        const updatedUser = await this.usersRepository.findOneBy({ id });
        if (updatedUser) {
            console.log('User updated in DB:', updatedUser);
            try {
                console.log('Calling saveUserDataToFile in update');
                await (0, file_handler_1.saveUserDataToFile)(updatedUser);
                console.log('User data saved to JSON file after update.');
            }
            catch (error) {
                console.error('Error saving user data to JSON file after update:', error);
            }
        }
        return updatedUser;
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
    async getUser(id) {
        return this.usersRepository.findOneBy({ id: parseInt(id) });
    }
    async updateUser(id, data) {
        console.log('updateUser method called with id:', id, 'data:', data);
        await this.usersRepository.update(parseInt(id), data);
        const updatedUser = await this.usersRepository.findOneBy({ id: parseInt(id) });
        if (updatedUser) {
            console.log('User updated in DB (updateUser):', updatedUser);
            try {
                console.log('Calling saveUserDataToFile in updateUser');
                await (0, file_handler_1.saveUserDataToFile)(updatedUser);
                console.log('User data saved to JSON file after updateUser.');
            }
            catch (error) {
                console.error('Error saving user data to JSON file after updateUser:', error);
            }
        }
        return updatedUser;
    }
    async updateProfilePicture(id, filename) {
        console.log('updateProfilePicture method called with id:', id, 'filename:', filename);
        const profilePicturePath = `/uploads/${filename}`;
        await this.usersRepository.update(parseInt(id), { profilePicture: profilePicturePath });
        const updatedUser = await this.usersRepository.findOneBy({ id: parseInt(id) });
        if (updatedUser) {
            try {
                console.log('Calling saveUserDataToFile in updateProfilePicture');
                await (0, file_handler_1.saveUserDataToFile)(updatedUser);
                console.log(`Profile picture updated for user ID: ${id} with file: ${profilePicturePath}`);
                console.log('User data saved to JSON file after updateProfilePicture.');
            }
            catch (error) {
                console.error('Error saving user data to JSON file after updateProfilePicture:', error);
            }
        }
        return updatedUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map