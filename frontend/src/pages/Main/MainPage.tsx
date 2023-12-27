import { useNavigate } from 'react-router';
import AppTitle from '@/components/AppTitle/AppTitle';
import { useUserSelector } from '@/redux/selectors';
import { Routes } from '@/routes/routes';
import { Box, Grid, Paper } from '@mantine/core';

function MainPage() {
  const { OnlineMatchFriend, OnlineMatchRandom, ComputerMatch } = Routes;
  const navigate = useNavigate();
  const {
    userData: { isLoggedIn },
  } = useUserSelector();

  const buttonsArray = [
    {
      name: 'You vs computer',
      route: ComputerMatch,
      disable: false,
    },
    {
      name: 'You vs friend',
      route: OnlineMatchFriend,
      disable: !isLoggedIn,
    },
    { name: 'You vs online player', route: OnlineMatchRandom, disable: !isLoggedIn },
  ];

  return (
    <Box
      pt={100}
      pl={32}
      pr={32}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <AppTitle />
      <Grid>
        {buttonsArray.map(({ name, route, disable }) => (
          <Grid.Col
            span={4}
            key={route}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Paper
              shadow="xs"
              p="xl"
              component="button"
              onClick={() => navigate(route)}
              disabled={disable}
              style={{
                backgroundColor: disable ? 'var(--mantine-color-gray-6)' : 'var(--mantine-color-blue-6)',
                color: 'var(--mantine-color-white)',
                width: '100%',
                height: '100%',
                cursor: disable ? 'not-allowed' : 'pointer',
                fontSize: '1.5rem',
              }}
            >
              {name}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}

export default MainPage;
