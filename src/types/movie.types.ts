export type MovieRating = 'G' | 'PG' | 'M' | 'MA' | 'R';

export type UserRole = 'MANAGER' | 'TEAMLEADER' | 'FLOORSTAFF';

export interface Movie {
  id: number;
  title: string;
  yearReleased: number;
  rating: MovieRating;
  imageUrl?: string | null;
}

export interface CreateMovieInput {
  title: string;
  yearReleased: number;
  rating: MovieRating;
}

export interface UpdateMovieInput extends Partial<CreateMovieInput> {
  id: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface AuthResponse {
  user?: User;
}
