import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Routes } from '@/routes/routes';
import useGameOver from '@/pages/OnlineMatch/hooks/useGameOver';
import useOnlineGameContext from '@/pages/OnlineMatch/context/useOnlineGameContext';
import { Button, Group, Modal, Title } from '@mantine/core';

const { Main } = Routes;

function EndGameModal() {
  const {
    socket,
    currentGameInfo: { gameId },
  } = useOnlineGameContext();
  const [rematchButton, setRematchButton] = useState({
    text: 'Rematch',
    disable: false,
  });

  const { isModalOpen, modalMessage, isWon } = useGameOver(setRematchButton);

  const navigate = useNavigate();

  const returnToMainMenu = () => {
    navigate(Main);
  };

  const gameRematch = () => {
    socket?.emit('game-rematch', { gameId });
    setRematchButton({ text: 'Waiting for your friend', disable: true });
  };

  return (
    <Modal
      centered
      title={isWon ? 'You Won' : 'You Lost'}
      opened={isModalOpen}
      onClose={() => {}}
    >
      <Title
        order={1}
        c="yellow"
        ta="center"
      >
        {modalMessage}
      </Title>
      <Group
        justify="end"
        mt={20}
      >
        <Button
          disabled={rematchButton.disable}
          onClick={gameRematch}
        >
          {rematchButton.text}
        </Button>
        <Button onClick={returnToMainMenu}>main menu</Button>
      </Group>
    </Modal>
  );
}

export default EndGameModal;
