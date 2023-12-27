import AppTitle from '@/components/AppTitle/AppTitle';
import { useUserSelector } from '@/redux/selectors';
import { Box, Loader, Title } from '@mantine/core';
import React from 'react';
import HistoryRow from '@/pages/MatchHistory/HistoryRow/HistoryRow';
import { useGetMatchHistory } from '@/api/queries/useGetMatchHistory';

function MatchHistoryPage() {
  const { data, isError, isLoading } = useGetMatchHistory();
  const {
    userData: { username },
  } = useUserSelector();

  return (
    <Box>
      <AppTitle>
        <Title order={2}>Match history</Title>
      </AppTitle>

      {isLoading && <Loader color="blue" />}

      {isError && <Title order={1}>Failed load match history</Title>}

      {data?.map(({ playerOne, playerTwo, gameWinnerName, matchId, isCanceled }) => {
        let connectedUser;
        let opponentUser;

        if (playerOne.username === username) {
          connectedUser = { ...playerOne };
          opponentUser = { ...playerTwo };
        } else {
          connectedUser = { ...playerTwo };
          opponentUser = { ...playerOne };
        }

        return (
          <HistoryRow
            key={matchId}
            connectedUserName={connectedUser.username}
            opponentUserName={opponentUser.username}
            gameWinnerName={gameWinnerName}
            gameCanceled={Boolean(isCanceled)}
          />
        );
      })}
      {data?.length === 0 && <Title order={3}>No history found</Title>}
    </Box>
  );
}

export default MatchHistoryPage;
