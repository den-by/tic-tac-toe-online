import React from 'react';
import OnlineMatchPage from '../../OnlineMatchPage';
import useUserJoined from '@/pages/OnlineMatch/hooks/useUserJoined';
import useSocket from '@/pages/OnlineMatch/hooks/useSocket';
import ConnectingMatch from './Connecting';

function PrivateRoom() {
  useSocket();

  const { showGame } = useUserJoined();

  return !showGame ? <ConnectingMatch /> : <OnlineMatchPage />;
}

export default PrivateRoom;
