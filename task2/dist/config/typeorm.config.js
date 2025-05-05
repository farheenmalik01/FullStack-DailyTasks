"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const user_entity_1 = require("../users/entities/user.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'farheen',
    password: 'farheen',
    database: 'users',
    entities: [user_entity_1.User],
    synchronize: true,
    logging: false,
};
//# sourceMappingURL=typeorm.config.js.map