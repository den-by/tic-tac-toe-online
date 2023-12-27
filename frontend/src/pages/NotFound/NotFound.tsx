import React from 'react';
import { Box, Title, Text } from '@mantine/core';

function NotFound() {
  return (
    <Box>
      <Title
        order={1}
        c="blue"
      >
        404 Error
      </Title>
      <Text>Page not found</Text>
    </Box>
  );
}

export default NotFound;
