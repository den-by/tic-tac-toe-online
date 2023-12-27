import { useState } from 'react';
import AuthModalContainer from '@/components/AuthenticationModals/AuthModalContainer/AuthModalContainer';
import UserModal from '@/components/UserModal/UserModal';
import { useUserSelector } from '@/redux/selectors';
import { Button, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaRegCircleUser } from 'react-icons/fa6';
function LoginButton() {
  const [isUserModal, setIsUserModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const {
    userData: { isLoggedIn },
  } = useUserSelector();

  const openUserModal = () => setIsUserModal(true);

  return (
    <>
      <AuthModalContainer
        opened={opened}
        onClose={close}
      />
      <UserModal
        isModalOpen={isUserModal}
        setIsModalOpen={setIsUserModal}
      />
      {isLoggedIn ? (
        <Button
          onClick={openUserModal}
          variant="transparent"
          style={{
            width: rem(50),
            height: rem(50),
            padding: 0,
          }}
        >
          <FaRegCircleUser
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Button>
      ) : (
        <Button onClick={open}>Login</Button>
      )}
    </>
  );
}

export default LoginButton;
