import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoUser } from './schemas/mongo-user.schema';

@Injectable()
export class MongoUsersService {
  constructor(@InjectModel('MongoUser') private readonly userModel: Model<MongoUser>) {}

  async findByEmail(email: string): Promise<MongoUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, pass: string): Promise<MongoUser | null> {
    const user = await this.findByEmail(email);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async updateTokenVersion(userId: string, tokenVersion: number): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { tokenVersion });
  }
}
