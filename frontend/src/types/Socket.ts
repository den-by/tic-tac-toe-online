import type { Socket as socketType } from 'socket.io-client';
import { BoardValues, WinningPattern } from './BoardValues';
import { OnlineGameProp } from './types';

export type Socket = undefined | socketType<ServerToClientEvents, ClientToServerEvents>;

interface ServerToClientEvents {
  'game-error': ({ msg }: { msg: string }) => void;
  'user-joined': (game: OnlineGameProp) => void;
  'game-started': () => void;
  'room-created': (gameId: string) => void;
  'round-started': () => void;
  'game-updated': ({ board, playerTurn }: { board: BoardValues[]; playerTurn: string }) => void;
  'listen-round-over': ({
    winner,
    winningPattern,
    isTie,
    byTime,
  }: {
    winner: BoardValues;
    winningPattern: WinningPattern;
    isTie: boolean;
    byTime: boolean;
  }) => void;
  'listen-game-rematch': () => void;
  'listen-game-over': ({ winner, isTie }: { winner: OnlineGameProp['playerOne']; isTie: boolean }) => void;
  'listen-game-canceled': ({ opponent }: { opponent: OnlineGameProp['playerOne'] }) => void;
  'received-message': ({ playerId, message }: { playerId: string; message: string }) => void;
}

interface ClientToServerEvents {
  'create-game': () => void;
  'close-game': ({ gameId }: { gameId: string }) => void;
  'join-game': ({ gameId }: { gameId: string }) => void;
  'ready-game': ({ gameId }: { gameId: string }) => void;
  'ready-round': ({ gameId }: { gameId: string }) => void;
  'open-online-room': () => void;
  'game-move': ({ board, playerTurn, gameId }: { board: BoardValues[]; playerTurn: string; gameId: string }) => void;
  'round-over': ({
    winner,
    winningPattern,
    isTie,
    gameId,
    winnerByTime,
  }: {
    winner?: BoardValues;
    winningPattern?: WinningPattern;
    isTie?: boolean;
    gameId: string;
    winnerByTime?: BoardValues;
  }) => void;
  'game-rematch': ({ gameId }: { gameId: string }) => void;

  'game-over': ({
    winner,
    gameId,
    scores,
  }: {
    winner: BoardValues;
    gameId: string;
    scores: { xScore: number; oScore: number; tie: number };
  }) => void;
  'send-message': ({ gameId, message }: { gameId: string; message: string }) => void;
}
