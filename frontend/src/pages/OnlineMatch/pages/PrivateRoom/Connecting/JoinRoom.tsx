import React, { Dispatch, SetStateAction } from 'react';
import useOnlineGameContext from '@/pages/OnlineMatch/context/useOnlineGameContext';
import AppTitle from '@/components/AppTitle/AppTitle';
import { Box, Button, Group, TextInput, Title, Text } from '@mantine/core';
import underwater from '@/assets/images/underwater.svg';
import { Image } from '@mantine/core';
import { useForm } from '@mantine/form';

const initialValues = { gameId: '' };

interface JoinRoomProps {
  setShowCreateRoom: Dispatch<SetStateAction<boolean>>;
}

function JoinRoom({ setShowCreateRoom }: JoinRoomProps) {
  const { socket } = useOnlineGameContext();
  const form = useForm({
    initialValues,

    validate: {
      gameId: (value) => value.trim().length === 0 && 'Game ID is required',
    },
  });

  const submitHandler = (values: typeof initialValues) => {
    const { gameId } = values;
    socket?.emit('join-game', { gameId });
  };

  const createGame = () => {
    socket?.emit('create-game');
    setShowCreateRoom(true);
  };

  return (
    <Box>
      <AppTitle>
        <Title order={2}>Play Tic Tac Toe Online With Your Friends</Title>
      </AppTitle>
      <Group
        w="100%"
        justify="center"
      >
        <Button
          onClick={createGame}
          size="xl"
        >
          Create New Game
        </Button>
        <Box>
          <Image
            mt={20}
            mb={20}
            h={300}
            w="100%"
            fit="contain"
            src={underwater}
            alt="murmaid is playing tic tac toe with an alien under the sea"
          />
        </Box>
        <Box>
          <Text c="blue">Set Game ID which you got from your friend</Text>
          <form onSubmit={form.onSubmit(submitHandler)}>
            <TextInput
              w="100%"
              placeholder="Game ID"
              withAsterisk
              {...form.getInputProps('gameId')}
            />
            <Text c="blue">and</Text>
            <Button
              fullWidth
              type="submit"
            >
              Join Game
            </Button>
          </form>
        </Box>
      </Group>
    </Box>
  );
}

export default JoinRoom;
