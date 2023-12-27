export type Player = {
  name: string;
  rating: number;
  socketId: string;
  userId: number;
};

export type OnlineGameProp = {
  playerOne: Player;
  playerTwo?: Player;
  gameId: string;
  readyCount: number;
  isGameOver: boolean;
};

export type GameWinner = 0 | 1 | 2;
