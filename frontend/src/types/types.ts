import { WinningPattern } from './BoardValues';

type Player = {
  name: string;
  rating: number;
  socketId: string;
  userId: number;
};

export type OnlineGameProp = {
  playerOne: Player;
  playerTwo: Player;
  gameId: string;
  readyCount: number;
  isOver: boolean;
};

export type GameOver = {
  isOver: boolean;
  winningPattern: WinningPattern;
  isTie: boolean;
};
