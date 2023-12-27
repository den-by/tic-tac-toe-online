import React, { ReactNode } from 'react';
import { Box, Title } from '@mantine/core';

function AppTitle({ children }: { children?: ReactNode }) {
  return (
    <Box c="blue">
      <Title
        order={1}
        size="90"
        mb="30"
        ta="center"
      >
        Tic Tac Toe Challenge
      </Title>
      {children}
    </Box>
  );
}

export default AppTitle;
