import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { MongoUsersService } from '../src/mongodb/mongo-users.service';
import { MongoUser, MongoUserSchema } from '../src/mongodb/schemas/mongo-user.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

describe('MongoUsersService Integration', () => {
  let service: MongoUsersService;
  let mongoConnection: Connection;
  let userModel: Model<MongoUser>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb+srv://farheen:farheen@cluster0.cbi68oh.mongodb.net/users-01?retryWrites=true&w=majority&appName=Cluster0'),
        MongooseModule.forFeature([{ name: 'MongoUser', schema: MongoUserSchema }]),
      ],
      providers: [MongoUsersService],
    }).compile();

    service = module.get<MongoUsersService>(MongoUsersService);
    userModel = module.get<Model<MongoUser>>(getModelToken('MongoUser'));
    mongoConnection = module.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should create and find a user by email', async () => {
    const user = new userModel({
      email: 'test@example.com',
      password: 'password123',
      tokenVersion: 1,
    });
    await user.save();

    const foundUser = await service.findByEmail('test@example.com');
    expect(foundUser).toBeDefined();
    expect(foundUser!.email).toBe('test@example.com');
  });

  it('should return null when user not found', async () => {
    const foundUser = await service.findByEmail('nonexistent@example.com');
    expect(foundUser).toBeNull();
  });

  it('should validate user with correct password', async () => {
    const user = new userModel({
      email: 'test@example.com',
      password: 'password123',
      tokenVersion: 1,
    });
    await user.save();

    const validatedUser = await service.validateUser('test@example.com', 'password123');
    expect(validatedUser).toBeDefined();
    expect(validatedUser!.email).toBe('test@example.com');
  });

  it('should not validate user with incorrect password', async () => {
    const user = new userModel({
      email: 'test@example.com',
      password: 'password123',
      tokenVersion: 1,
    });
    await user.save();

    const validatedUser = await service.validateUser('test@example.com', 'wrongpassword');
    expect(validatedUser).toBeNull();
  });

  it('should update tokenVersion', async () => {
    const user = new userModel({
      email: 'test@example.com',
      password: 'password123',
      tokenVersion: 1,
    });
    await user.save();

    await service.updateTokenVersion(user._id.toString(), 2);
    const updatedUser = await userModel.findById(user._id).exec();
    expect(updatedUser!.tokenVersion).toBe(2);
  });
});
