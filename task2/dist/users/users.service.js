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
        if (Array.isArray(createUserDto)) {
            throw new Error('createUserDto should not be an array');
        }
        const user = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(user);
    }
    async update(id, updateUserDto) {
        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOneBy({ id });
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
    getUser(id) {
        return this.users.find(user => user.id === id);
    }
    updateUser(id, data) {
        const user = this.getUser(id);
        if (user) {
            Object.assign(user, data);
        }
        return user;
    }
    updateProfilePicture(id, filename) {
        const user = this.getUser(id);
        if (user) {
            user.profilePicture = filename;
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map