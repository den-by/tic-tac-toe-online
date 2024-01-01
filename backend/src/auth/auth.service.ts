import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthResponse } from "./types/auth.response";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import * as _ from "lodash";

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
