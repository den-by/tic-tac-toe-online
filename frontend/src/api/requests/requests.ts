import axiosInstance from '../axiosInstance';
import { MatchHistory } from '@/api/types/matchHistory';
import { UserInfo } from '@/api/types/userInfo';

type UserFormDetails = {
  username: string;
  password: string;
  resetForm: () => void;
};

export const getMatchHistory = async () => {
  const serverResponse = await axiosInstance.get<MatchHistory>('/matches/current-user');

  return serverResponse.data;
};

export const getUserDetails = async () => {
  const serverResponse = await axiosInstance.get<UserInfo>('/users/current');

  return serverResponse.data;
};

export const createUser = async ({ username, password }: UserFormDetails) => {
  return await axiosInstance.post('/auth/register', {
    username,
    password,
  });
};

export const checkLoginDetails = async ({ username, password }: UserFormDetails) => {
  const serverResponse = await axiosInstance.post('/auth/login', {
    username,
    password,
  });
  const { loginToken, userData } = serverResponse.data;
  return { loginToken, userData };
};
