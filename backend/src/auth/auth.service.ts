import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

import { AuthResponse } from "./types/auth.response";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import * as _ from "lodash";

import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { CreateUserResponseDto } from "../users/dto/CreateUserResponseDto";

@Injectable()
export class AuthService {
  logger = new Logger("Auth Service");

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private createJwtToken({ id, username }: { id: string; username: string }) {
    return this.jwtService.sign({ id, username });
  }

  async getUsernameFromToken(token: string): Promise<string | null> {
    try {
      const payload = this.jwtService.verify(token);
      const { username } = payload;
      if (typeof username === "string") return username;
    } catch (e) {
      this.logger.error(e);
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;
    const user = await this.usersService.findOneByUsername(username);
    if (!user) throw new BadRequestException("Name or Password are incorrect");

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException("Name or Password are incorrect");

    const token = this.createJwtToken({
      id: user.id.toString(),
      username: user.username,
    });

    return {
      loginToken: token,
      userData: _.omit(user, ["password"]),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const user = await this.usersService.create(createUserDto);

      const token = this.createJwtToken({
        id: user.id.toString(),
        username: user.username,
      });

      return { token };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof Error && e.message === "User already exists") {
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException("Something went wrong");
      }
    }
  }

  async getUserSafely(id: number): Promise<Omit<User, "password">> {
    const user: User = await this.usersService.getUserOrThrow(id);

    return _.omit(user, ["password"]);
  }
}
