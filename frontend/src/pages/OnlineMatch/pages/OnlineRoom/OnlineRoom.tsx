import React from 'react';
import OnlineSearchLoader from '@/pages/OnlineMatch/components/OnlineSearchLoader/OnlineSearchLoader';
import useSocket from '@/pages/OnlineMatch/hooks/useSocket';
import useUserJoined from '@/pages/OnlineMatch/hooks/useUserJoined';
import OnlineMatchPage from '../../OnlineMatchPage';
import useOpenOnlineRoom from './hooks/useOpenOnlineRoom';

function OnlineRoom() {
  useSocket();

  useOpenOnlineRoom();

  const { showGame } = useUserJoined();

  return !showGame ? <OnlineSearchLoader /> : <OnlineMatchPage />;
}

export default OnlineRoom;
