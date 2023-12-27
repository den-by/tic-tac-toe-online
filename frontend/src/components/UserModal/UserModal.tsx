import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Routes } from '@/routes/routes';
import { logout } from '@/redux/user';
import { Box, Button, Group, Modal, rem, Text, Title } from '@mantine/core';
import { LiaUserSecretSolid } from 'react-icons/lia';
import { Dispatch, SetStateAction } from 'react';
import { useGetCurrentUserInfo } from '@/api/queries/useGetCurrentUserInfo';

interface UserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
const { Main, MatchHistory } = Routes;
function UserModal({ isModalOpen, setIsModalOpen }: UserModalProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCurrentUserInfo(isModalOpen);
  const { username, rating } = data ?? {
    username: '',
    rating: 0,
  };

  const closeModal = () => setIsModalOpen(false);

  const goToMatchHistoryPage = () => {
    navigate(MatchHistory);
    closeModal();
  };
  const logOutUser = () => {
    dispatch(logout());
    navigate(Main);
    closeModal();
  };

  return (
    <Modal
      opened={isModalOpen}
      onClose={closeModal}
      title="User Info"
      centered
    >
      <Box
        maw={340}
        mx="auto"
      >
        {isLoading && <h1>loading...</h1>}
        {data && (
          <Box ta="center">
            <LiaUserSecretSolid
              style={{
                width: rem(100),
                height: rem(100),
                color: 'var(--mantine-color-blue-filled)',
              }}
            />
            <Title order={1}>{username}</Title>
            <Group
              align="center"
              justify="center"
              mb={25}
              mt={25}
            >
              <Text size="xl">Rating: </Text>
              <Text
                fw={500}
                c="green"
                size="xl"
              >
                {rating}
              </Text>
            </Group>

            <Group justify="space-between">
              <Button onClick={goToMatchHistoryPage}>Match History</Button>
              <Button
                onClick={logOutUser}
                color="red"
              >
                Logout
              </Button>
            </Group>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default UserModal;
