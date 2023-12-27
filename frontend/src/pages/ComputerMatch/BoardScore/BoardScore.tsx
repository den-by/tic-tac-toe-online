import React from 'react';
import { Box, Group, Text } from '@mantine/core';

interface BoardScoreProps {
  xScore: number;
  tie: number;
  oScore: number;
}

function BoardScore({ xScore, tie, oScore }: BoardScoreProps) {
  return (
    <Group
      justify="space-around"
      mb={30}
    >
      <Box>
        <Group>
          <Text
            size="xl"
            fw={700}
          >
            You
          </Text>
          <Text
            size="xl"
            fw={700}
            c="blue"
          >
            (X)
          </Text>
        </Group>
        <Text
          size="xl"
          fw={700}
          c="yellow"
        >
          {xScore}
        </Text>
      </Box>
      <Box>
        <Text
          size="xl"
          fw={700}
        >
          Tie
        </Text>
        <Text
          size="xl"
          fw={700}
          c="yellow"
        >
          {tie}
        </Text>
      </Box>
      <Box>
        <Group>
          <Text
            size="xl"
            fw={700}
          >
            Computer
          </Text>
          <Text
            size="xl"
            fw={700}
            c="red"
          >
            (O)
          </Text>
        </Group>
        <Text
          size="xl"
          fw={700}
          c="yellow"
        >
          {oScore}
        </Text>
      </Box>
    </Group>
  );
}

export default BoardScore;
