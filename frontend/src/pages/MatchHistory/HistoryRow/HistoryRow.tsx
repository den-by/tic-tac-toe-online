import React from 'react';
import { Avatar, Box, Group, Paper, rem, Text } from '@mantine/core';
import { ImUserTie } from 'react-icons/im';
import { FaUserSecret } from 'react-icons/fa6';

interface HistoryRowProps {
  connectedUserName: string;
  opponentUserName: string;
  gameWinnerName: string | null;
  gameCanceled: boolean;
}

function HistoryRow({ connectedUserName, opponentUserName, gameWinnerName, gameCanceled }: HistoryRowProps) {
  const winningText = gameWinnerName === connectedUserName ? 'You won' : !gameWinnerName ? 'Tie' : 'You lost';
  const finalText = gameCanceled ? `${winningText} (Canceled) ` : winningText;
  const color = gameWinnerName === connectedUserName ? 'green' : 'red';

  return (
    <Paper
      shadow="lg"
      p={20}
      mb={20}
    >
      <Group justify="space-between">
        <Group>
          <Avatar
            color="blue"
            size={rem(60)}
          >
            <ImUserTie size="2rem" />
          </Avatar>
          <Text>{connectedUserName}</Text>
        </Group>
        <Box>
          <Text
            fw={700}
            size="xl"
            c={color}
          >
            {finalText}
          </Text>
        </Box>
        <Group>
          <Avatar
            color="blue"
            size={rem(60)}
          >
            <FaUserSecret size="2rem" />
          </Avatar>
          <Text>{opponentUserName}</Text>
        </Group>
      </Group>
    </Paper>
  );
}

export default HistoryRow;
