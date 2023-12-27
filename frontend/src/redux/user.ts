import { createSlice } from '@reduxjs/toolkit';
import { UserSliceState } from './types/slices';
import { toast } from 'react-hot-toast';

type ReduxLoginAction = {
  payload: { loginToken: string; userData: UserSliceState['userData'] };
};

type ReduxUpdateUserData = {
  payload: Partial<UserSliceState['userData']>;
};

const userDataInitialValues: UserSliceState['userData'] = {
  rating: 0,
  id: 0,
  username: '',
  isLoggedIn: false,
};

const initialState = {
  userData: {
    ...userDataInitialValues,
  },
};

const loginHandler = (state: UserSliceState, action: ReduxLoginAction) => {
  const { userData, loginToken } = action.payload;
  try {
    state.userData = userData;
    sessionStorage.setItem('token', loginToken);
  } catch (error) {
    toast.error('Error while logging in');
  }
};

const logoutHandler = (state: UserSliceState) => {
  state.userData = userDataInitialValues;
  sessionStorage.clear();
};

const updateUserData = (state: UserSliceState, action: ReduxUpdateUserData) => {
  const userData = action.payload;
  state.userData = { ...state.userData, ...userData };
};

const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: loginHandler,
    logout: logoutHandler,
    updateData: updateUserData,
  },
});

export const { login, logout, updateData } = counterSlice.actions;
export default counterSlice.reducer;
