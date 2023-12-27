import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  logger = new Logger("MatchesService");

  async saveMatchResults({
    player1Id,
    player2Id,
    winnerId,
    gameCanceled,
  }: {
    player1Id: number;
    player2Id: number;
    winnerId: number;
    gameCanceled?: boolean;
  }) {
    const ratingChanges = 10;
    //TODO: add transaction
    await this.usersService.updateRating(
      player1Id,
      winnerId === player1Id ? ratingChanges : -ratingChanges,
    );
    await this.usersService.updateRating(
      player2Id,
      winnerId === player2Id ? ratingChanges : -ratingChanges,
    );
    await this.prisma.match.create({
      data: {
        players: {
          connect: [{ id: player1Id }, { id: player2Id }],
        },
        isCanceled: gameCanceled,
        winnerId,
      },
    });
  }

  async findByUserIdAndUsers(userId: number) {
    const result = await this.prisma.match.findMany({
      include: {
        players: true,
      },
      where: {
        players: {
          some: {
            id: userId,
          },
        },
      },
    });
    return result.map((match) => {
      const player1 = match.players[0];
      const player2 = match.players[1];
      return {
        id: match.id,
        gameWinnerName:
          match.winnerId === player1.id ? player1.username : player2.username,
        playerOne: {
          id: player1.id,
          username: player1.username,
          rating: player1.rating,
        },
        playerTwo: {
          id: player2.id,
          username: player2.username,
          rating: player2.rating,
        },
        winnerId: match.winnerId,
        isCanceled: match.isCanceled,
      };
    });
  }
}
