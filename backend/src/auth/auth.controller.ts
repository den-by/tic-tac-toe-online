import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";

import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
