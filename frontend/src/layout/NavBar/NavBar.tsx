import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Routes } from '@/routes/routes';
import LoginButton from '@/layout/NavBar/LoginButton/LoginButton';
import { Group } from '@mantine/core';
import TrophyButton from '@/layout/NavBar/TrophyButton/TrophyButton';
import BackButton from '@/layout/NavBar/BackButton/BackButton';

const { Main, OnlineMatchFriend, ComputerMatch, OnlineMatchRandom, MatchHistory } = Routes;

interface Button {
  element: React.ReactElement;
  toRoute: Routes;
}

const leftButton: { [key: string]: Button } = {
  [Main]: { element: <TrophyButton />, toRoute: MatchHistory },
  [MatchHistory]: { element: <BackButton />, toRoute: Main },
  [OnlineMatchFriend]: { element: <BackButton />, toRoute: Main },
  [ComputerMatch]: { element: <BackButton />, toRoute: Main },
  [OnlineMatchRandom]: { element: <BackButton />, toRoute: Main },
};

function NavBar() {
  const { pathname } = useLocation();

  return (
    <Group
      justify="space-between"
      p="2rem"
    >
      <Link to={leftButton[pathname].toRoute}>{leftButton[pathname].element ?? null}</Link>
      <LoginButton />
    </Group>
  );
}

export default NavBar;
