import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { omit } from "lodash";
import { faker } from "@faker-js/faker";

describe("Auth Service", () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let bcryptCompareSync: jest.SpyInstance;

  beforeEach(() => {
    usersService = {
      findOneByUsername: jest.fn(),
      create: jest.fn(),
      getUserOrThrow: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    service = new AuthService(usersService, jwtService);

    bcryptCompareSync = jest.spyOn(bcrypt, "compareSync");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login a user with correct credentials", async () => {
    const mockUser = {
      id: 1,
      username: faker.internet.userName(),
      password: faker.internet.password(),
    } as User;

    const loginDto: LoginDto = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    usersService.findOneByUsername.mockResolvedValue(mockUser);
    bcryptCompareSync.mockReturnValue(true);
    jwtService.sign.mockReturnValue("token");

    const result = await service.login(loginDto);

    expect(usersService.findOneByUsername).toHaveBeenCalledWith(
      loginDto.username,
    );
    expect(bcryptCompareSync).toHaveBeenCalledWith(
      loginDto.password,
      mockUser.password,
    );
    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toEqual({
      loginToken: "token",
      userData: omit(mockUser, ["password"]),
    });
  });

  it("should throw bad request exception on incorrect login", async () => {
    usersService.findOneByUsername.mockResolvedValue(null);

    const loginDto: LoginDto = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
  });

  it("should register new user and return auth data for him", async () => {
    const mockUser = {
      id: 1,
      username: faker.internet.userName(),
      password: faker.internet.password(),
    } as User;

    const createUserDto: CreateUserDto = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    usersService.create.mockResolvedValue(mockUser);
    jwtService.sign.mockReturnValue("token");

    const result = await service.register(createUserDto);

    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toEqual({
      token: "token",
    });
  });

  it("should return a user by id excluding his password", async () => {
    const mockUser = {
      id: 1,
      username: faker.internet.userName(),
      password: faker.internet.password(),
    } as User;

    usersService.getUserOrThrow.mockResolvedValue(mockUser);

    const result = await service.getUserSafely(1);

    expect(usersService.getUserOrThrow).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      id: 1,
      username: mockUser.username,
    });
  });
});
