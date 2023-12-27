import React from 'react';
import AppTitle from '@/components/AppTitle/AppTitle';
import { Group, Loader, Text } from '@mantine/core';

function OnlineSearchLoader() {
  return (
    <>
      <AppTitle>ONLINE</AppTitle>
      <Group
        justify="center"
        mt={40}
      >
        <Loader
          color="blue"
          type="bars"
        />
        <Text c="blue">Looking for an opponent...</Text>
      </Group>
    </>
  );
}

export default OnlineSearchLoader;
