import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../auth/repositories/user.repository', () => ({
  userRepository: {
    update: vi.fn(),
  },
}));

const { userRepository } = await import('../../../auth/repositories/user.repository');
const { updateProfile } = await import('../../services/update-profile.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateProfile', () => {
  it('updates the user profile fields and returns the trimmed result', async () => {
    vi.mocked(userRepository.update).mockResolvedValue({
      id: 'user-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP',
    } as never);

    const result = await updateProfile('user-1', {
      firstName: 'Ada',
      lastName: 'Lovelace',
      avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP',
    });

    expect(userRepository.update).toHaveBeenCalledWith({
      userId: 'user-1',
      newData: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP',
      },
    });
    expect(result).toEqual({
      id: 'user-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP',
    });
  });

  it('clears the avatar when an empty string is passed', async () => {
    vi.mocked(userRepository.update).mockResolvedValue({
      id: 'user-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      avatar: null,
    } as never);

    await updateProfile('user-1', { firstName: 'Ada', lastName: 'Lovelace', avatar: '' });

    expect(userRepository.update).toHaveBeenCalledWith({
      userId: 'user-1',
      newData: { firstName: 'Ada', lastName: 'Lovelace', avatar: null },
    });
  });
});
