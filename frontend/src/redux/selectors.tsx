import { useSelector } from 'react-redux';
import { UserSelectorState } from './types/selectors';

export function useUserSelector() {
  return useSelector((state: UserSelectorState) => state.user);
}
