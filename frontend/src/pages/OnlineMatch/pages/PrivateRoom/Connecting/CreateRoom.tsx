import React, { Dispatch, SetStateAction, useState } from 'react';
import AppTitle from '@/components/AppTitle/AppTitle';
import useOnlineGameContext from '@/pages/OnlineMatch/context/useOnlineGameContext';
import useRoomCreated from './hooks/useRoomCreated';
import { Box, Button, Group, Title, Text, Tooltip } from '@mantine/core';
import { LuClock4 } from 'react-icons/lu';
import { FaRegCopy } from 'react-icons/fa';

interface CreateRoomProps {
  setShowCreateRoom: Dispatch<SetStateAction<boolean>>;
}

function CreateRoom({ setShowCreateRoom }: CreateRoomProps) {
  const { socket } = useOnlineGameContext();
  const { newGameId } = useRoomCreated();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newGameId);
    setCopied(true);
  };

  const onToolTipMouseOut = () => setCopied(false);

  const closeRoom = () => {
    socket?.emit('close-game', { gameId: newGameId });
    setShowCreateRoom(false);
  };

  return (
    <Box>
      <AppTitle>
        <Group justify="center">
          <LuClock4 size={30} />
          <Title order={2}>Waiting for your friend to join</Title>
        </Group>
      </AppTitle>
      <Text
        mt={20}
        mb={20}
      >
        Here is your game id, send it to your friend
      </Text>
      <Box mb={30}>
        <Tooltip
          label={copied ? 'Copied' : 'Copy to clipboard'}
          position="right"
          withArrow
        >
          <Button
            variant="outline"
            rightSection={<FaRegCopy />}
            onClick={copyToClipboard}
            onMouseOut={onToolTipMouseOut}
          >
            {newGameId}
          </Button>
        </Tooltip>
      </Box>
      <Button
        onClick={closeRoom}
        size="md"
        color="red"
      >
        Close this game
      </Button>
    </Box>
  );
}

export default CreateRoom;
