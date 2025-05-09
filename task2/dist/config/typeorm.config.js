"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const user_entity_1 = require("../users/entities/user.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'farheen',
    password: process.env.DB_PASSWORD || 'farheen',
    database: process.env.DB_DATABASE || 'users',
    entities: [user_entity_1.User],
    synchronize: true,
    logging: false,
};
//# sourceMappingURL=typeorm.config.js.map