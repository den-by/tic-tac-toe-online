import { Logger, OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { GameWinner, OnlineGameProp } from "./types";

import { AuthService } from "../auth/auth.service";
import { MatchesService } from "../matches/matches.service";
import { UsersService } from "../users/users.service";
import { authenticationErrorMessages } from "./constants";

//TODO: move to config
const websiteUrl = process.env.WEBSITE_URL;

const games: OnlineGameProp[] = [];
let openOnlineRoom: OnlineGameProp | any = {};

const findCurrentGame = (gameId: string, gamesArr: typeof games) => {
  return gamesArr.find((game) => game.gameId === gameId);
};

const connectionStatuses: Record<string, boolean> = {};

function isConnectedToSocket(username: any) {
  return connectionStatuses[username];
}

function updateUserConnectedStatus(username: any, b: boolean) {
  connectionStatuses[username] = b;
}

@WebSocketGateway({
  cors: {
    origin: [websiteUrl],
  },
})
export class Gateway implements OnModuleInit {
  logger = new Logger("Gateway");
  constructor(
    private authService: AuthService,
    //TODO: use event emitter instead of direct call
    private matchesService: MatchesService,
    private usersService: UsersService,
  ) {}
  @WebSocketServer()
  server: Server;
  userId: string;

  onModuleInit() {
    const io = this.server;
    io.use(async (socket, next) => {
      const authorizationHeader = socket.handshake.headers?.authorization;

      if (!authorizationHeader) {
        next(new Error(authenticationErrorMessages.invalidToken));
        return;
      }
      const token = authorizationHeader.split(" ")[1];
      const tokenUsername = await this.authService.getUsernameFromToken(token);

      if (!tokenUsername) {
        next(new Error(authenticationErrorMessages.invalidToken));
        return;
      }
      const user = await this.usersService.findOneByUsername(tokenUsername);

      if (!user) {
        next(new Error(authenticationErrorMessages.userNotFound));
        return;
      }

      if (isConnectedToSocket(user.username)) {
        next(new Error(authenticationErrorMessages.userAlreadyConnected));
        return;
      }
      try {
        updateUserConnectedStatus(user.username, true);
      } catch {
        next(
          new Error(authenticationErrorMessages.failedToUpdateConnectionStatus),
        );
        return;
      }
      socket.data.playerDetails = {
        userId: user.id,
        username: user.username,
        rating: user.rating,
      };
      next();
    });

    this.server.on("connection", (socket) => {
      const connectedSocketUserId = socket.id;
      const { userId, username, rating } = socket.data.playerDetails;

      const readyGame = (gameId: string, emitId: string) => {
        const game = findCurrentGame(gameId, games);
        if (!game) return;

        if (game.readyCount === 1) {
          game.readyCount = 0;
          game.isGameOver = false;
          io.to(gameId).emit(emitId);
        } else {
          game.readyCount += 1;
        }
      };

      socket.on("send-message", ({ message, gameId }) => {
        io.to(gameId).emit("received-message", {
          message,
          playerId: connectedSocketUserId,
        });
      });

      socket.on("open-online-room", async () => {
        const roomId = uuidv4();

        const joinOnlineGame = () => {
          const room = openOnlineRoom;
          socket.join(room.gameId);
          room.playerTwo = {
            name: username,
            rating,
            socketId: connectedSocketUserId,
            userId,
          };

          games.push(room);
          openOnlineRoom = {};

          io.to(room.gameId).emit("user-joined", room);
        };
        //TODO: use event emitter instead of direct call
        const createOnlineGame = () => {
          openOnlineRoom = {
            gameId: roomId,
            playerOne: {
              name: username,
              rating,
              socketId: connectedSocketUserId,
              userId,
            },
            readyCount: 0,
            isGameOver: false,
          };

          socket.join(roomId);
        };

        if (openOnlineRoom.gameId) {
          joinOnlineGame();
        } else {
          createOnlineGame();
        }
      });

      socket.on("create-game", async () => {
        const roomId = uuidv4();

        socket.join(roomId);
        games.push({
          gameId: roomId,
          playerOne: {
            name: username,
            rating,
            socketId: connectedSocketUserId,
            userId,
          },
          readyCount: 0,
          isGameOver: false,
        });

        io.to(roomId).emit("room-created", roomId);
      });

      socket.on("close-game", ({ gameId }) => {
        const gameToClose = findCurrentGame(gameId, games);

        if (!gameToClose) {
          socket.emit("game-error", { msg: "room not found" });
          return;
        }

        if (gameToClose.playerOne.socketId === connectedSocketUserId) {
          games.splice(games.indexOf(gameToClose), 1);
          socket.leave(gameId);
        } else {
          socket.emit("game-error", { msg: "You can not close this room" });
        }
      });

      socket.on("join-game", async ({ gameId }) => {
        const room = io.sockets.adapter.rooms.get(gameId);
        const game = findCurrentGame(gameId, games);

        if (!room || !game) {
          return socket.emit("game-error", {
            msg: `Game "${gameId}" does not exist`,
          });
        }

        if (room.size >= 2) {
          return socket.emit("game-error", { msg: "Game is full" });
        }

        socket.join(gameId);
        game.playerTwo = {
          name: username,
          rating,
          socketId: connectedSocketUserId,
          userId,
        };

        return io.to(gameId).emit("user-joined", game);
      });

      socket.on("ready-game", ({ gameId }) => {
        readyGame(gameId, "game-started");
      });

      socket.on("ready-round", ({ gameId }) => {
        readyGame(gameId, "round-started");
      });

      socket.on("game-move", ({ board, playerTurn, gameId }) => {
        io.to(gameId).emit("game-updated", { board, playerTurn });
      });
      //TODO: use event emitter instead of direct call
      socket.on(
        "round-over",
        ({ winner, winningPattern, isTie, gameId, winnerByTime }) => {
          const roundOverData = {
            ...(winnerByTime && {
              winner: winnerByTime,
              byTime: true,
            }),
            ...(!winnerByTime && { winner, winningPattern, isTie }),
          };

          io.to(gameId).emit("listen-round-over", roundOverData);
        },
      );

      socket.on("game-rematch", ({ gameId }) => {
        readyGame(gameId, "listen-game-rematch");
      });
      //TODO: use event emitter instead of direct call
      socket.on("game-over", async ({ winner, gameId }) => {
        const game = findCurrentGame(gameId, games);
        if (!game) return;
        const { playerOne, playerTwo } = game;
        let gameWinner: GameWinner = 0;
        game.isGameOver = true;
        if (winner === "O") {
          gameWinner = 2;
          io.to(gameId).emit("listen-game-over", {
            winner: playerTwo,
          });
        } else if (winner === "X") {
          gameWinner = 1;
          io.to(gameId).emit("listen-game-over", {
            winner: playerOne,
          });
        } else io.to(gameId).emit("listen-game-over", { isTie: true });

        if (playerOne.socketId === socket.id) {
          if (!playerTwo) throw new Error("playerTwo is undefined");
          await this.matchesService.saveMatchResults({
            player1Id: playerOne.userId,
            player2Id: playerTwo.userId,
            gameCanceled: false,
            winnerId: gameWinner === 1 ? playerOne.userId : playerTwo.userId,
          });
        }
      });

      socket.on("disconnect", async () => {
        const closeOnlineGame = () => {
          if (
            openOnlineRoom.gameId &&
            (openOnlineRoom.playerOne.socketId === connectedSocketUserId ||
              openOnlineRoom.playerTwo.socketId === connectedSocketUserId)
          ) {
            openOnlineRoom = {};
          }
        };
        //TODO: use event emitter instead of direct call
        const closeCostumeOnlineGame = () => {
          games.find(async (game) => {
            const { playerOne, playerTwo } = game;
            games.splice(games.indexOf(game), 1);
            if (game.isGameOver) return true;

            let gameWinner: GameWinner;
            if (playerOne.socketId === connectedSocketUserId) {
              gameWinner = 2;
              if (playerTwo) {
                io.to(playerTwo.socketId).emit("listen-game-canceled", {
                  opponent: playerOne,
                });
              }
            } else {
              gameWinner = 1;
              io.to(playerOne.socketId).emit("listen-game-canceled", {
                opponent: playerTwo,
              });
            }

            if (!playerTwo) throw new Error("playerTwo is undefined");

            await this.matchesService.saveMatchResults({
              player1Id: playerOne.userId,
              player2Id: playerTwo.userId,
              gameCanceled: true,
              winnerId: gameWinner === 1 ? playerOne.userId : playerTwo.userId,
            });
            return true;
          });
        };

        closeOnlineGame();

        closeCostumeOnlineGame();
        try {
          updateUserConnectedStatus(username, false);
        } catch {
          this.logger.error(
            authenticationErrorMessages.failedToUpdateConnectionStatus,
          );
        }

        this.logger.log(`User ${username} disconnected`);
      });
    });
  }
}
