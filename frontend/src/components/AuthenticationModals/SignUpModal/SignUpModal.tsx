import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { registerValidationSchema } from '@/validation/userValidation';
import ErrorHandler from '@/api/ErrorHandler';
import useRegisterMutation from '@/api/mutations/useRegisterMutation';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai';

const CREATED_USER_TEXT = 'Your account has been created';
const USERNAME_EXISTS_ERROR_TEXT = 'Sorry, this username already exists';
type RegisterModalProps = {
  closeModal: () => void;
};
type InitialValues = typeof initialValues;

const initialValues = {
  username: '',
  password: '',
  confirmPassword: '',
};

function SignUpModal({ closeModal }: RegisterModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const iconClickHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>) => setter((prev) => !prev);

  const form = useForm({
    initialValues,

    validate: yupResolver(registerValidationSchema),
  });

  const onSuccess = (resetForm: () => void, loadingToastId: string) => {
    toast.success(CREATED_USER_TEXT, { id: loadingToastId });
    closeModal();
    resetForm();
  };

  const onError = (error: unknown, loadingToastId: string) => {
    const errorMessage = ErrorHandler(error);
    if (errorMessage.includes('Duplicate')) {
      toast.error(USERNAME_EXISTS_ERROR_TEXT, {
        id: loadingToastId,
      });
    } else {
      toast.error(errorMessage, {
        id: loadingToastId,
      });
    }
  };

  const { isLoading, mutate } = useRegisterMutation(onSuccess, onError);

  const submitHandler = (values: InitialValues, resetForm: () => void) => {
    const { username, password } = values;
    mutate({ resetForm, username, password });
  };

  const eyeIcon = (isVisible: boolean, setIsVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
    return isVisible ? (
      <AiOutlineEyeInvisible onClick={() => iconClickHandler(setIsVisible)} />
    ) : (
      <AiOutlineEye onClick={() => iconClickHandler(setIsVisible)} />
    );
  };

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
          rightSection={eyeIcon(isPasswordVisible, setIsPasswordVisible)}
          mb={20}
          {...form.getInputProps('password')}
        />
        <TextInput
          type={isConfirmPasswordVisible ? 'text' : 'password'}
          withAsterisk
          label="Confirm Password"
          placeholder="Enter Your Password"
          rightSection={eyeIcon(isConfirmPasswordVisible, setIsConfirmPasswordVisible)}
          mb={20}
          {...form.getInputProps('confirmPassword')}
        />
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            type="submit"
            loading={isLoading}
          >
            Register
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default SignUpModal;
