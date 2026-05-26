import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/profile';

export const PROFILE_KEY = ['profile'];

// Current user's profile (subscription tier/status, etc.).
export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
  });
}
