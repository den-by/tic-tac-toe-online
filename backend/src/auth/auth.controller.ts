import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { Serialize } from "../common/intreceptors/serialize.inteceptor";
import { CreateUserResponseDto } from "../users/dto/CreateUserResponseDto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Serialize(CreateUserResponseDto)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return await this.authService.register(createUserDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
