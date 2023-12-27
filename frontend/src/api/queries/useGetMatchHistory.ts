import { useQuery } from '@tanstack/react-query';
import { getMatchHistory } from '@/api/requests/requests';
import { apiKeys } from '@/api/keys';

export function useGetMatchHistory() {
  return useQuery([apiKeys.matchHistory], getMatchHistory);
}
