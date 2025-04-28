export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

export const mockUsersService = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
};