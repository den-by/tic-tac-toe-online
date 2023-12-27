import React, { useState } from 'react';
import SignUpModal from '@/components/AuthenticationModals/SignUpModal/SignUpModal';
import { Modal, Button, Group, Text } from '@mantine/core';
import SignInModal from '@/components/AuthenticationModals/SignInModal/SignInModal';

export const NAVIGATION_OPTIONS = {
  SIGN_UP: 'SIGN_UP',
  SIGN_IN: 'SIGN_IN',
};

const { SIGN_IN, SIGN_UP } = NAVIGATION_OPTIONS;

type AuthModalProps = {
  opened: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthModalContainer({ opened, onClose }: AuthModalProps) {
  const [modalPage, setModalPage] = useState(SIGN_IN);

  const closeModal = () => {
    onClose(false);
    setModalPage(SIGN_IN);
  };

  const displayModalPage = {
    [SIGN_IN]: {
      pageToRender: <SignInModal closeModal={closeModal} />,
      title: 'Sign in',
      footer: {
        paragraph: 'Dont have an account yet?',
        link: {
          text: 'Sign up',
          navigateFunction: () => setModalPage(SIGN_UP),
        },
      },
    },
    [SIGN_UP]: {
      pageToRender: <SignUpModal closeModal={closeModal} />,
      title: 'Sign up',
      footer: {
        paragraph: 'Already have an account?',
        link: { text: 'Sign in', navigateFunction: () => setModalPage(SIGN_IN) },
      },
    },
  };

  const {
    pageToRender,
    title,
    footer: {
      link: { text: NavigateText, navigateFunction },
      paragraph,
    },
  } = displayModalPage[modalPage];

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title={title}
      centered
    >
      {pageToRender}
      <Group
        justify="flex-end"
        mt="md"
        gap="0"
      >
        <Text
          c="grey"
          size="sm"
        >
          {paragraph}
        </Text>
        <Button
          size="xs"
          onClick={navigateFunction}
          variant="white"
          color="gray"
        >
          {NavigateText}
        </Button>
      </Group>
    </Modal>
  );
}

export default AuthModalContainer;
