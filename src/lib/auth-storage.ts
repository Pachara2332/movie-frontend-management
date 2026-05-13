import type { User } from '../types/movie.types';

const AUTH_USER_KEY = 'authUser';

export const authStorage = {
  getUser: (): User | null => {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as User;
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  },

  setUser: (user: User) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  clear: () => {
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
