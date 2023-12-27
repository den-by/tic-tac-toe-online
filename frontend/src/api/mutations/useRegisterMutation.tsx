import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createUser } from '@/api/requests/requests';

const LOADING_TEXT = 'Creating User';

function useRegisterMutation(
  onSuccess: (resetForm: () => void, loadingToastId: string) => void,
  onError: (error: unknown, loadingToastId: string) => void
) {
  return useMutation(createUser, {
    onError: (error, variabels, context) => {
      const loadingToastId = context as string;
      onError(error, loadingToastId);
    },
    onSuccess: (data, variabels, context) => {
      const { resetForm } = variabels;
      onSuccess(resetForm, context as string);
    },
    onMutate: () => {
      return toast.loading(LOADING_TEXT);
    },
  });
}

export default useRegisterMutation;
