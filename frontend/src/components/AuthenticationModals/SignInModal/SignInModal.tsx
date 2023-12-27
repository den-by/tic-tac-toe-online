import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai';
import { loginValidationSchema } from '@/validation/userValidation';
import { login } from '@/redux/user';
import ErrorHandler from '@/api/ErrorHandler';
import useLoginMutation from '@/api/mutations/useLoginMutation';
import { UserSliceState } from '@/redux/types/slices';
import { Button, TextInput, Box, Group, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { refresh } from '@/routes/helpers';

type LoginModalProps = {
  closeModal: () => void;
};

type InitialValues = typeof initialValues;

const successLoginMessage = 'Logged In Successfully';
const initialValues = {
  username: '',
  password: '',
};

function SignInModal({ closeModal }: LoginModalProps) {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const form = useForm({
    initialValues,

    validate: yupResolver(loginValidationSchema),
  });
  const iconClickHandler = () => setIsPasswordVisible((prevState) => !prevState);

  const onSuccess = (
    resetForm: () => void,
    loginToken: string,
    userData: UserSliceState['userData'],
    loadingToastId: string
  ) => {
    resetForm();
    dispatch(login({ loginToken, userData: { ...userData, isLoggedIn: true } }));
    toast.success(successLoginMessage, {
      id: loadingToastId,
    });
    closeModal();
    refresh();
  };

  const onError = (error: unknown, loadingToastId: string) => {
    const errorMessage = ErrorHandler(error);
    if (errorMessage === 'unauthorized') {
      setIsAuthorized(false);
      toast.dismiss(loadingToastId);
    } else {
      toast.error(errorMessage, {
        id: loadingToastId,
      });
    }
  };
  const { isLoading, mutate } = useLoginMutation(onSuccess, onError);

  const submitHandler = (values: InitialValues, resetForm: () => void) => {
    const { username, password } = values;
    setIsAuthorized(true);
    mutate({
      resetForm,
      username,
      password,
    });
  };

  const eyeIcon = isPasswordVisible ? (
    <AiOutlineEyeInvisible onClick={iconClickHandler} />
  ) : (
    <AiOutlineEye onClick={iconClickHandler} />
  );

  return (
    <Box
      maw={340}
      mx="auto"
      ta="left"
    >
      <form
        onSubmit={form.onSubmit((values) => {
          submitHandler(values, form.reset);
        })}
      >
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Enter Your Username"
          leftSection={<AiOutlineUser />}
          mb={20}
          {...form.getInputProps('username')}
        />
        <TextInput
          type={isPasswordVisible ? 'text' : 'password'}
          withAsterisk
          label="Password"
          placeholder="Enter Your Password"
          rightSection={eyeIcon}
          mb={20}
          {...form.getInputProps('password')}
        />
        <Group
          justify="flex-end"
          mt="md"
        >
          {!isAuthorized && <Text c="red">Wrong Username or Password</Text>}
          <Button
            type="submit"
            loading={isLoading}
            loaderProps={{
              type: 'dots',
            }}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default SignInModal;
