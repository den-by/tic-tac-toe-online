import React, { ReactNode } from 'react';
import { BoardValues, BoardValuesEnum, WinningPattern } from '@/types/BoardValues';
import WinningLine from '@/components/Board/WinningLine/WinningLine';
import { Box, Button, Grid, Paper, rem, Text } from '@mantine/core';
import { RxCross2 } from 'react-icons/rx';
import { FaRegCircle } from 'react-icons/fa';

interface BoardProps {
  board: BoardValues[];
  onClick: (index: number) => void;
  gameOver: {
    isOver: boolean;
    winningPattern: WinningPattern;
    isTie: boolean;
  };
  inactiveMessage: ReactNode;
  isCellsActive?: boolean;
}

const { XSign, OSign, emptySign } = BoardValuesEnum;

function Board({ board, onClick, gameOver, isCellsActive, inactiveMessage }: BoardProps) {
  const { isOver, winningPattern, isTie } = gameOver;

  const currentElement = {
    [OSign]: (
      <FaRegCircle
        style={{
          width: rem(60),
          height: rem(60),
          color: 'var(--mantine-color-red-filled)',
        }}
      />
    ),
    [XSign]: (
      <RxCross2
        style={{
          width: rem(70),
          height: rem(70),
          color: 'var(--mantine-color-blue-filled)',
        }}
      />
    ),
    [emptySign]: null,
  };

  return (
    <Box>
      {isOver && inactiveMessage && (
        <Text
          size="xl"
          c="blue"
        >
          {inactiveMessage}
        </Text>
      )}
      <Paper
        shadow="sm"
        p="xs"
        bg="gray"
        style={{
          position: 'relative',
        }}
      >
        {isOver && !isTie && <WinningLine winningPattern={winningPattern} />}
        <Grid>
          {board.map((value, index) => {
            const isCellActive = value === emptySign && !isOver && isCellsActive;

            return (
              <Grid.Col
                span={4}
                style={{ minHeight: rem(120) }}
                key={index}
              >
                <Button
                  variant="white"
                  fullWidth
                  onClick={() => isCellActive && onClick(index)}
                  style={{
                    cursor: isCellActive ? 'pointer' : 'default',
                    height: '100%',
                  }}
                >
                  {currentElement[value]}
                </Button>
              </Grid.Col>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}

export default Board;
