import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { MyStuff } from '../src/users/entities/my-stuff.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {}, // mock repository
        },
        {
          provide: getRepositoryToken(MyStuff),
          useValue: {}, // mock repository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
