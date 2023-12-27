import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthResponse } from "./types/auth.response";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";

import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  logger = new Logger("Auth Service");

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken({ id, username }: { id: string; username: string }) {
    return this.jwtService.sign({ id, username });
  }

  async decodeLoginToken(token: string): Promise<string> {
    let tokenusername = "";

    try {
      const payload = this.jwtService.verify(token);
      const { username } = payload;
      tokenusername = username;
    } catch (err) {
      console.log("Token verification failed:", err);
    }

    return tokenusername;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;
    const user = await this.usersService.findOneByUsername(username);
    if (!user) throw new BadRequestException("Name or Password are incorrect");

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException("Name or Password are incorrect");

    const token = this.getJwtToken({
      id: user.id.toString(),
      username: user.username,
    });

    return {
      loginToken: token,
      userData: user,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const user = await this.usersService.create(createUserDto);

      const token = this.getJwtToken({
        id: user.id.toString(),
        username: user.username,
      });

      return { loginToken: token, userData: user };
    } catch (error) {
      // TODO add util for handling unknown errors
      const errorMessage =
        typeof error === "object" && error instanceof Error
          ? error.message
          : "unknown error";
      this.logger.error(errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  //TODO: make optional only password
  async getUserSafely(id: number): Promise<Partial<User>> {
    const user: Partial<User> = await this.usersService.getUserOrThrow(id);

    delete user.password;

    return user;
  }
}
