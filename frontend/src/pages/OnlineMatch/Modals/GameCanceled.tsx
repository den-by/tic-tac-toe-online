import React from 'react';
import { useNavigate } from 'react-router';
import { Routes } from '@/routes/routes';
import useGameCanceled from '@/pages/OnlineMatch/hooks/useGameCanceled';
import { Modal, Title } from '@mantine/core';

const { Main } = Routes;

function GameCanceled() {
  const { isModalOpen, opponentLeft } = useGameCanceled();
  const navigate = useNavigate();

  const returnToMainMenu = () => navigate(Main);

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={returnToMainMenu}
    >
      <Title
        ta="center"
        order={1}
        c="blue"
      >
        Oh no! {opponentLeft} left the game
      </Title>
    </Modal>
  );
}

export default GameCanceled;
