import { Schema, Document } from 'mongoose';

export interface MongoUser extends Document {
  email: string;
  password: string;
  tokenVersion: number;
}

export const MongoUserSchema = new Schema<MongoUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokenVersion: { type: Number, default: 0 },
});
