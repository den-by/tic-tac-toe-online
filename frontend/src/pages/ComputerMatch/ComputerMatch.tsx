import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from '@/components/Board/Board';
import checkWinner from '@/components/Board/functions/checkWinner';
import { BoardValues, BoardValuesEnum, WinningPattern } from '@/types/BoardValues';
import { GameOver } from '@/types/types';
import BoardScore from './BoardScore/BoardScore';
import findBestMove from '@/components/Board/functions/findBestMove';
import randomMove from '@/components/Board/functions/randomMove';
import { Box, Button, rem } from '@mantine/core';

const { XSign, OSign, emptySign } = BoardValuesEnum;

const startingScores = { xScore: 0, oScore: 0, tie: 0 };

const defaultSquares = new Array(9).fill(emptySign);

function ComputerMatch() {
  const actionCounter = useRef(0);
  const isWinnerAvailable = actionCounter.current >= 4;
  const isTieAvailable = actionCounter.current >= 8;
  const [currentWinner, setCurrentWinner] = useState('');
  const [xPlaying, setXPlaying] = useState(true);

  const [board, setBoard] = useState<BoardValues[]>(defaultSquares);
  const [gameOver, setGameOver] = useState<GameOver>({
    isOver: false,
    winningPattern: [0, 0, 0],
    isTie: false,
  });

  const [scores, setScores] = useState(startingScores);
  const [isComputerTurn, setIsComputerTurn] = useState(false);

  const setWinPattern = useCallback(
    (pattern: WinningPattern | undefined) => {
      if (pattern) {
        setGameOver((prev) => ({
          ...prev,
          isOver: true,
          winningPattern: pattern,
        }));
      } else if (isTieAvailable) {
        setGameOver((prev) => ({
          ...prev,
          isOver: true,
          isTie: true,
        }));
      }
    },
    [isTieAvailable]
  );

  const updateGameScore = useCallback(
    (winner: BoardValues | undefined) => {
      if (winner) {
        if (winner === OSign) {
          setScores((prev) => ({ ...prev, oScore: prev.oScore + 1 }));
        }
        if (winner === XSign) {
          setScores((prev) => ({ ...prev, xScore: prev.xScore + 1 }));
        }
      } else if (isTieAvailable) {
        setScores((prev) => ({ ...prev, tie: prev.tie + 1 }));
      }
    },
    [isTieAvailable]
  );

  const handleCellClick = useCallback(
    (cellIndex: number) => {
      actionCounter.current += 1;

      const updateBoard = board.map((value, boardIndex) => {
        if (boardIndex === cellIndex) {
          return xPlaying ? XSign : OSign;
        }
        return value;
      });
      setBoard(updateBoard);
      setXPlaying((prev) => !prev);

      if (isWinnerAvailable) {
        const { winner, winPattern } = checkWinner(updateBoard);
        setCurrentWinner(winner || '');
        updateGameScore(winner);
        setWinPattern(winPattern);
      }

      setIsComputerTurn((prev) => !prev);
    },
    [xPlaying, board, updateGameScore, isWinnerAvailable, setWinPattern]
  );

  const resetBoard = () => {
    setGameOver({
      isOver: false,
      winningPattern: [0, 0, 0],
      isTie: false,
    });
    actionCounter.current = 0;
    setCurrentWinner('');
    setBoard(defaultSquares);
  };

  useEffect(() => {
    const isComputerTurnValid = isComputerTurn && !gameOver.isOver && !gameOver.isTie;

    if (isComputerTurnValid) {
      let computerMove;
      const randomNumber = Math.floor(Math.random() * 10);
      const isPlayBestMove = randomNumber > 1;
      if (isPlayBestMove) {
        computerMove = findBestMove(board);
      } else {
        computerMove = randomMove(board);
      }
      handleCellClick(computerMove);
    }
  }, [
    board,
    isComputerTurn,
    xPlaying,
    gameOver.isOver,
    gameOver.isTie,
    updateGameScore,
    isWinnerAvailable,
    setWinPattern,
    handleCellClick,
  ]);

  const boardInactiveMessage = () => {
    if (gameOver.isTie) {
      return 'Tie!';
    }
    const OWon = currentWinner === OSign;
    return OWon ? 'O Won!' : 'X Won!';
  };

  return (
    <Box>
      <BoardScore {...scores} />
      <Box
        mb={50}
        style={{
          height: rem(400),
          width: rem(400),
          margin: '0 auto',
        }}
      >
        <Board
          board={board}
          onClick={handleCellClick}
          gameOver={gameOver}
          isCellsActive={!isComputerTurn}
          inactiveMessage={boardInactiveMessage()}
        />
      </Box>
      <Button
        size="xl"
        onClick={resetBoard}
      >
        Start New Game
      </Button>
    </Box>
  );
}

export default ComputerMatch;
