import { configureStore, Dispatch } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import userReducer, { login } from './user';
import { getUserDetails } from '@/api/requests/requests';
import { toast } from 'react-hot-toast';

const store = configureStore({ reducer: { user: userReducer } });

const getUserInfoMiddleware = async (dispatch: Dispatch) => {
  const userToken = sessionStorage.getItem('token');
  if (!userToken) {
    return;
  }
  try {
    const userData = await getUserDetails();
    const userDataWithIsLogged = { ...userData, isLoggedIn: true };
    dispatch(login({ userData: userDataWithIsLogged, loginToken: userToken }));
  } catch (error) {
    toast.error('Something went wrong');
  }
};

store.dispatch(getUserInfoMiddleware);

function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
