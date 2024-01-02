import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { MatchesService } from "./matches.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("Match")
@Controller("matches")
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get("current-user")
  @ApiOperation({ summary: "Get current user matches" })
  @ApiBearerAuth()
  currentUser(@CurrentUser() userId: number) {
    return this.matchesService.findByUserIdAndUsers(userId);
  }
}
