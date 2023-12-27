import React, { useCallback } from 'react';
import Board from '../../components/Board/Board';
import checkWinner from '@/components/Board/functions/checkWinner';
import { BoardValuesEnum } from '@/types/BoardValues';
import useGameStatus from '@/pages/OnlineMatch/hooks/useGameStatus';
import useGameMoveUpdate from '@/pages/OnlineMatch/hooks/useGameMoveUpdate';
import PlayerInfo from '@/pages/OnlineMatch/components/PlayerInfo/PlayerInfo';
import useOnlineGameContext from '@/pages/OnlineMatch/context/useOnlineGameContext';
import EndGameModal from './Modals/EndGameModal';
import GameCanceled from './Modals/GameCanceled';
import { Box, Group, Title, rem, Text, Button } from '@mantine/core';

const { XSign, OSign } = BoardValuesEnum;

function OnlineMatchPage() {
  const { socket, gameOver, board, currentGameInfo } = useOnlineGameContext();
  const {
    playerOne: { socketId: playerOneId },
    playerTwo: { socketId: playerTwoId },
    gameId,
  } = currentGameInfo;
  const currentPlayer = socket?.id === playerOneId ? currentGameInfo.playerOne : currentGameInfo.playerTwo;

  const opponentPlayer = socket?.id === playerOneId ? currentGameInfo.playerTwo : currentGameInfo.playerOne;

  const PLAYER_SIGN = playerOneId === socket?.id ? XSign : OSign;
  const { canPlay } = useGameMoveUpdate(playerOneId);
  const { endGameMessage } = useGameStatus();

  const toggleTurn = () => {
    let updatedTurn;

    if (canPlay === playerOneId) {
      updatedTurn = playerTwoId;
    } else {
      updatedTurn = playerOneId;
    }

    return updatedTurn;
  };

  const handleCellClick = (cellIndex: number) => {
    const updateBoard = board.map((value, boardIndex) => {
      if (boardIndex === cellIndex) {
        return PLAYER_SIGN;
      }
      return value;
    });

    socket?.emit('game-move', {
      board: updateBoard,
      playerTurn: toggleTurn(),
      gameId,
    });

    const { winner, winPattern, isTie } = checkWinner(updateBoard);
    if (winner) {
      socket?.emit('round-over', {
        winner,
        winningPattern: winPattern,
        gameId,
      });
    }
    if (isTie) {
      socket?.emit('round-over', {
        isTie: true,
        gameId,
      });
    }
  };

  const boardInactiveMessage = (
    <Group
      justify="center"
      mb={20}
    >
      <Title order={1}>{endGameMessage.headerText}</Title>
      <Box>
        <Text>{endGameMessage.mainText}</Text>
        {endGameMessage.buttonText && (
          <Button
            color="green"
            onClick={endGameMessage.onClick}
          >
            {endGameMessage.buttonText}
          </Button>
        )}
      </Box>
    </Group>
  );

  const timerFunction = useCallback(() => {
    if (canPlay === socket?.id) {
      socket?.emit('round-over', {
        gameId,
        winnerByTime: PLAYER_SIGN === XSign ? OSign : XSign,
      });
    }
  }, [canPlay, PLAYER_SIGN, gameId, socket]);

  return (
    <>
      <Box>
        <Group justify="space-around">
          <PlayerInfo
            {...{
              isPlaying: canPlay === opponentPlayer.socketId && !gameOver.isOver,
              playerScore: opponentPlayer.rating,
              playerName: opponentPlayer.name,
              timerFunction,
              gameLive: !gameOver.isOver,
            }}
          />
          <PlayerInfo
            {...{
              isPlaying: canPlay === currentPlayer.socketId && !gameOver.isOver,
              playerScore: currentPlayer.rating,
              playerName: currentPlayer.name,
              timerFunction,
              gameLive: !gameOver.isOver,
            }}
          />
        </Group>
        <Box
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
            isCellsActive={canPlay === socket?.id}
            inactiveMessage={boardInactiveMessage}
          />
        </Box>
      </Box>
      <EndGameModal />
      <GameCanceled />
    </>
  );
}

export default OnlineMatchPage;
