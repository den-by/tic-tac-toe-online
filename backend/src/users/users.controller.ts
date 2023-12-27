import { Controller, Get } from "@nestjs/common";

import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("current")
  @ApiOperation({ summary: "Get current user" })
  @ApiBearerAuth()
  current(@CurrentUser() userId: number) {
    return this.usersService.findOne(userId);
  }
}
