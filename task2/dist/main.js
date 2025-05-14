"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/uploads', express.static((0, path_1.join)(__dirname, '..', 'uploads')));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CRUD API')
        .setDescription('Handles the createuser, signin, get, post and other APIs')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(50000);
    console.log('Server running at http://localhost:50000');
}
bootstrap();
//# sourceMappingURL=main.js.map