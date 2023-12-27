interface Match {
  createdAt: string;
  gameWinnerName: string | null;
  isCanceled: boolean;
  matchId: number;
  playerOne: { id: number; rating: number; username: string };
  playerTwo: { id: number; rating: number; username: string };
}

export type MatchHistory = Match[];
