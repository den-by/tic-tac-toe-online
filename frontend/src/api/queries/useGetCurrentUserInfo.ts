import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from '@/api/requests/requests';
import { apiKeys } from '@/api/keys';

export function useGetCurrentUserInfo(isActive: boolean) {
  return useQuery([apiKeys.userDetails], getUserDetails, { enabled: isActive });
}
