import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { UserSliceState } from '@/redux/types/slices';
import { checkLoginDetails } from '@/api/requests/requests';

const LOADING_TEXT = 'Signing In...';

type LoginData = {
  userData: UserSliceState['userData'];
  loginToken: string;
};

function useLoginMutation(
  onSuccess: (
    resetForm: () => void,
    loginToken: string,
    userData: UserSliceState['userData'],
    loadingToastId: string
  ) => void,
  onError: (error: unknown, loadingToastId: string) => void
) {
  return useMutation(checkLoginDetails, {
    onError: (error, variabels, context) => {
      const loadingToastId = context as string;
      onError(error, loadingToastId);
    },
    onSuccess: (data: LoginData, variables, context) => {
      const { resetForm } = variables;
      const { loginToken, userData } = data;
      const loadingToastId = context as string;
      onSuccess(resetForm, loginToken, userData, loadingToastId);
    },
    onMutate: () => {
      return toast.loading(LOADING_TEXT);
    },
  });
}

export default useLoginMutation;
