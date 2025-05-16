import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { DataSource, Repository } from 'typeorm';
import { MyStuff } from '../src/users/entities/my-stuff.entity';
import { User } from '../src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

jest.setTimeout(30000);

describe('MyStuffController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let myStuffRepository: Repository<MyStuff>;
  let jwtToken: string;
  let userId: number;
  let myStuffId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_SECRET: 'testsecret' })],
        }),
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, MyStuff],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = app.get(DataSource);
    userRepository = dataSource.getRepository(User);
    myStuffRepository = dataSource.getRepository(MyStuff);

    // Create a test user
    const user = userRepository.create({
      firstName: 'Test',
      lastName: 'User',
      age: 30,
      email: 'testuser@example.com',
      password: 'password',
    });
    const savedUser = await userRepository.save(user);
    userId = savedUser.id;

    // Simulate login or generate JWT token for test user
    // For simplicity, assume a valid token is set here
    // Replace with actual login or token generation if needed
    jwtToken = 'Bearer your_valid_jwt_token_here';
  });

  afterAll(async () => {
    if (myStuffRepository) {
      await myStuffRepository.delete({});
    }
    if (userRepository) {
      await userRepository.delete({});
    }
    await app.close();
  });

  it('should create a new my-stuff item', async () => {
    const createDto = {
      title: 'Test Item',
      description: 'Test description',
    };
    const response = await request(app.getHttpServer())
      .post(`/users/${userId}/my-stuff`)
      .set('Authorization', jwtToken)
      .send(createDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(createDto.title);
    expect(response.body.description).toBe(createDto.description);
    expect(response.body.userId).toBe(userId);
    myStuffId = response.body.id;
  });

  it('should get all my-stuff items for the user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}/my-stuff`)
      .set('Authorization', jwtToken)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a my-stuff item by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/my-stuff/${myStuffId}`)
      .set('Authorization', jwtToken)
      .expect(200);

    expect(response.body).toHaveProperty('id', myStuffId);
  });

  it('should update a my-stuff item', async () => {
    const updateDto = {
      title: 'Updated Title',
      description: 'Updated description',
    };
    const response = await request(app.getHttpServer())
      .put(`/users/my-stuff/${myStuffId}`)
      .set('Authorization', jwtToken)
      .send(updateDto)
      .expect(200);

    expect(response.body.title).toBe(updateDto.title);
    expect(response.body.description).toBe(updateDto.description);
  });

  it('should delete a my-stuff item', async () => {
    await request(app.getHttpServer())
      .delete(`/users/my-stuff/${myStuffId}`)
      .set('Authorization', jwtToken)
      .expect(200);

    // Verify deletion
    await request(app.getHttpServer())
      .get(`/users/my-stuff/${myStuffId}`)
      .set('Authorization', jwtToken)
      .expect(403); // Access denied or not found
  });

  it('should deny access to my-stuff of other users', async () => {
    // Create another user
    const otherUser = userRepository.create({
      firstName: 'Other',
      lastName: 'User',
      age: 25,
      email: 'otheruser@example.com',
      password: 'password',
    });
    const savedOtherUser = await userRepository.save(otherUser);

    // Create my-stuff for other user
    const otherMyStuff = myStuffRepository.create({
      title: 'Other User Item',
      description: 'Other description',
      user: savedOtherUser,
    });
    const savedMyStuff = await myStuffRepository.save(otherMyStuff);

    // Try to access other user's my-stuff with original user's token
    await request(app.getHttpServer())
      .get(`/users/my-stuff/${savedMyStuff.id}`)
      .set('Authorization', jwtToken)
      .expect(403);
  });
});
