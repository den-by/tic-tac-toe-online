import React from 'react';
import { TiArrowBackOutline } from 'react-icons/ti';
import { rem } from '@mantine/core';

function BackButton() {
  const buttonStyle = {
    width: rem(40),
    height: rem(40),
    color: 'var(--mantine-color-blue-filled)',
  };
  return (
    <TiArrowBackOutline
      style={{
        ...buttonStyle,
      }}
    />
  );
}

export default BackButton;
