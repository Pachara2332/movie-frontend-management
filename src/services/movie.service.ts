import { axiosInstance } from '../lib/axios';
import type { Movie, CreateMovieInput } from '../types/movie.types';

const BASE_URL = '/movies';

class MovieService {
  /**
   * Get all movies
   */
  async getAll(): Promise<Movie[]> {
    try {
      const response = await axiosInstance.get<Movie[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  /**
   * Get a single movie by ID
   */
  async getById(id: number): Promise<Movie> {
    try {
      const response = await axiosInstance.get<Movie>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new movie
   */
  async create(movieData: CreateMovieInput): Promise<Movie> {
    try {
      const response = await axiosInstance.post<Movie>(BASE_URL, movieData);
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  }

  /**
   * Update an existing movie
   */
  async update(id: number, movieData: Partial<CreateMovieInput>): Promise<Movie> {
    try {
      const response = await axiosInstance.put<Movie>(`${BASE_URL}/${id}`, movieData);
      return response.data;
    } catch (error) {
      console.error(`Error updating movie with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a movie (requires MANAGER or ADMIN role)
   */
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting movie with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Upload or replace movie image using cookie-based auth.
   */
  async uploadImage(movieId: number, file: File): Promise<Movie> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}${BASE_URL}/${movieId}/image/upload`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(errorData?.message || 'Upload image failed');
    }

    return response.json() as Promise<Movie>;
  }
}

export const movieService = new MovieService();
