import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

import useOnlineGameContext from '@/pages/OnlineMatch/context/useOnlineGameContext';

const { VITE_SERVER_URL } = import.meta.env;

interface IError {
  message: string;
}
function useSocket() {
  const { socket, setSocket } = useOnlineGameContext();
  const render = useRef(0);
  useEffect(() => {
    if (render.current === 0) {
      const token = sessionStorage.getItem('token');
      setSocket(
        io(VITE_SERVER_URL, {
          extraHeaders: { Authorization: `Bearer ${token}` },
        })
      );
    }
    return () => {
      render.current += 1;
    };
  }, [setSocket]);
  useEffect(() => {
    socket?.on('connect', () => {});
    socket?.on('connect_error', (err: IError) => {
      toast.error(err.message);
    });
    socket?.on('disconnect', () => {});

    socket?.on('game-error', ({ msg }) => {
      toast.error(msg);
    });

    return () => {
      socket?.disconnect();
      socket?.off('connect');
      socket?.off('connect_error');
      socket?.off('disconnect');
      socket?.off('game-error');
    };
  }, [socket]);
}

export default useSocket;
