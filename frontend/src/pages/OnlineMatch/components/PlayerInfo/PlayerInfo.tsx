import React from 'react';
import { Avatar, Box, Group, Pill, rem, Text } from '@mantine/core';
import { FaUserSecret } from 'react-icons/fa6';
interface PlayerGameProfileProps {
  isPlaying: boolean;
  playerScore: number;
  playerName: string;
}

function PlayerInfo({ isPlaying, playerScore, playerName }: PlayerGameProfileProps) {
  return (
    <Box>
      <Avatar
        color="blue"
        size={rem(130)}
        mb={10}
      >
        <FaUserSecret size="4rem" />
      </Avatar>
      <Pill
        size="xl"
        mb={10}
      >
        <Group pt={5}>
          <Text>Total rating</Text>
          <Text c="yellow">{playerScore}</Text>
        </Group>
      </Pill>
      <Group
        mb={10}
        justify="center"
      >
        <Text>{playerName}</Text>
        <Text c="green">{isPlaying && ' is playing'}</Text>
        <Text c="red">{!isPlaying && ' is waiting'}</Text>
      </Group>
    </Box>
  );
}

export default PlayerInfo;
