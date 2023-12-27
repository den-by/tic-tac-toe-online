import { Module } from "@nestjs/common";
import { MatchesService } from "./matches.service";
import { PrismaModule } from "../prisma/prisma.module";
import { MatchesController } from "./matches.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [MatchesService],
  exports: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
