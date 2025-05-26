import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoUsersService } from './mongo-users.service';
import { MongoUserSchema } from './schemas/mongo-user.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_ATLAS_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'MongoUser', schema: MongoUserSchema, collection: 'nestjs' }]),
  ],
  providers: [MongoUsersService],
  exports: [MongoUsersService],
})
export class MongodbModule {}
