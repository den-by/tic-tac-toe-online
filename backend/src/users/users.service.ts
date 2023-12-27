import {
  BadRequestException,
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto): Promise<User> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        username: createUserDto.username,
      },
    });

    if (findUser) {
      throw new BadRequestException("User already exists");
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = bcrypt.hashSync(createUserDto.password, salt);

      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashPassword,
        },
      });
    } catch (error: unknown) {
      this.logger.error(error);
      // TODO add util for handling unknown errors
      const message = error instanceof Error ? error.message : "unknown error";
      throw new InternalServerErrorException(message);
    }
  }

  findOneByUsername(name: string) {
    return this.prisma.user.findFirst({
      where: {
        username: name,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserOrThrow(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return user;
  }

  async updateRating(userId: number, ratingDelta: number) {
    const user = await this.getUserOrThrow(userId);
    let newrating = user.rating + ratingDelta;
    if (newrating < 0) {
      newrating = 0;
    }
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        rating: newrating,
      },
    });
  }
}
