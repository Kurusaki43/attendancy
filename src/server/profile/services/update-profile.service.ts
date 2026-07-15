import { userRepository } from '@/server/auth/repositories/user.repository';
import type { UpdateProfileInput } from '@/server/profile/schemas/update-profile.schema';
import type { ServiceUpdateProfileResult } from '@/server/profile/types';

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<ServiceUpdateProfileResult> {
  const user = await userRepository.update({
    userId,
    newData: {
      firstName: input.firstName,
      lastName: input.lastName,
      avatar: input.avatar === '' ? null : input.avatar,
    },
  });

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
  };
}
