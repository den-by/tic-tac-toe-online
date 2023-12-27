import { Module } from "@nestjs/common";
import { Gateway } from "./gateway";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { MatchesModule } from "../matches/matches.module";

@Module({
  providers: [Gateway],
  imports: [AuthModule, UsersModule, MatchesModule],
})
export class GatewayModule {}
