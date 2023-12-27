import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useOnlineGameContext from '@/pages/OnlineMatch/context/useOnlineGameContext';
import { useQueryClient } from '@tanstack/react-query';

interface IGameOver {
  text: string;
  disable: boolean;
}

function useGameOver(setRematchButton: Dispatch<SetStateAction<IGameOver>>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isWon, setIsWon] = useState(false);
  const { socket } = useOnlineGameContext();
  const queryClient = useQueryClient();
  useEffect(() => {
    socket?.on('listen-game-over', ({ winner, isTie }) => {
      if (winner) {
        if (winner.socketId === socket?.id) {
          setModalMessage('Congratulations! You Won!');
          setIsWon(true);
        } else {
          setModalMessage('Sorry, You Lost!');
        }
      } else if (isTie) {
        setModalMessage('Its A Tie!');
      }
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
      setIsModalOpen(true);
    });

    return () => {
      socket?.off('listen-game-over');
    };
  }, [socket, setIsModalOpen]);

  useEffect(() => {
    socket?.on('listen-game-rematch', () => {
      setIsWon(false);
      setIsModalOpen(false);
      setRematchButton({
        text: 'rematch',
        disable: false,
      });
    });

    return () => {
      socket?.off('listen-game-rematch');
    };
  }, [socket, setRematchButton]);

  return { isModalOpen, modalMessage, isWon };
}

export default useGameOver;
