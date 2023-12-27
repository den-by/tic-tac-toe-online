import React from 'react';
import { rem } from '@mantine/core';
import { AiOutlineTrophy } from 'react-icons/ai';
import { useUserSelector } from '@/redux/selectors';

function TrophyButton() {
  const {
    userData: { isLoggedIn },
  } = useUserSelector();

  const buttonStyle = {
    width: rem(80),
    height: rem(80),
    color: isLoggedIn ? 'var(--mantine-color-yellow-filled)' : 'var(--mantine-color-gray-6)',
    cursor: isLoggedIn ? 'pointer' : 'default',
  };

  return (
    <AiOutlineTrophy
      style={{
        ...buttonStyle,
      }}
    />
  );
}

export default TrophyButton;
