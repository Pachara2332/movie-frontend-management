import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, Film, LayoutGrid, List, LogOut, Plus, Star, X } from 'lucide-react';

import MovieForm from '../components/movies/MovieForm';
import MovieGrid from '../components/movies/MovieGrid';
import MovieTable from '../components/movies/MovieTable';
import { getApiErrorMessage } from '../lib/api-error';
import { authService } from '../services/auth.service';
import { movieService } from '../services/movie.service';
import type { Movie } from '../types/movie.types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const currentUser = authService.getStoredUser();

  const latestRelease = useMemo(() => {
    if (movies.length === 0) {
      return '-';
    }

    return Math.max(...movies.map((movie) => movie.yearReleased));
  }, [movies]);

  const commonRating = useMemo(() => {
    if (movies.length === 0) {
      return '-';
    }

    const ratingCounts = movies.reduce<Record<string, number>>((counts, movie) => {
      counts[movie.rating] = (counts[movie.rating] || 0) + 1;
      return counts;
    }, {});

    return Object.entries(ratingCounts).sort(([, a], [, b]) => b - a)[0][0];
  }, [movies]);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await movieService.getAll();
      setMovies(response);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load movies'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadMovies();
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [loadMovies]);

  const handleAddMovie = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleDeleteMovie = async (id: number) => {
    try {
      await movieService.delete(id);
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete movie'));
    }
  };

  const handleFormSubmit = (movie: Movie) => {
    if (editingMovie) {
      setMovies((currentMovies) =>
        currentMovies.map((currentMovie) => (currentMovie.id === movie.id ? movie : currentMovie))
      );
    } else {
      setMovies((currentMovies) => [...currentMovies, movie]);
    }

    setShowForm(false);
    setEditingMovie(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white text-left">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-220px] right-[-120px] w-[540px] h-[540px] rounded-full border border-[#f5c518]/20 opacity-70" />
        <div className="absolute bottom-[-260px] left-[-170px] w-[620px] h-[620px] rounded-full border border-white/10 opacity-60" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#f5c518]/10 to-transparent" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121212]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-md bg-[#f5c518] px-2.5 py-1 text-lg font-black tracking-[-0.04em] text-black">
              IMDb
            </div>
            <div className="hidden sm:block h-7 w-px bg-white/15" />
            <div>
              <h1 className="text-xl font-bold tracking-tight m-0">Movie Management</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-md border border-[#f5c518]/30 bg-[#f5c518]/10 text-[#f5c518] text-xs font-bold uppercase tracking-wider">
              {currentUser?.role || 'FLOORSTAFF'}
            </div>
            <p className="text-xs text-[#b8b8b8] mt-0.5">
                Signed in as <span className="text-[#f5c518]">{currentUser?.username || 'Guest'}</span>
              </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[#e6e6e6] transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <section className="mb-8">
          <div className="flex flex-col gap-3 border-l-4 border-[#f5c518] pl-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-[#f5c518]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f5c518]">
              <Clapperboard size={14} />
              Assignment ready
            </div>
            <h2 className="max-w-3xl text-4xl font-black leading-tight text-white">
              Curate, update, and protect your movie catalog.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[#b8b8b8]">
              Cookie-based authentication, role-aware actions, and a focused IMDb-inspired interface for movie operations.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#121212] border border-white/10 rounded-lg p-6 shadow-2xl shadow-black/30">
            <p className="text-sm font-semibold text-[#b8b8b8]">Total Movies</p>
            <h2 className="text-4xl font-semibold mt-3">{movies.length}</h2>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-lg p-6 shadow-2xl shadow-black/30">
            <p className="text-sm font-semibold text-[#b8b8b8]">Latest Release</p>
            <h2 className="text-4xl font-semibold mt-3">{latestRelease}</h2>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-lg p-6 shadow-2xl shadow-black/30">
            <p className="text-sm font-semibold text-[#b8b8b8]">Most Common Rating</p>
            <h2 className="inline-flex items-center gap-2 text-4xl font-semibold mt-3">
              <Star className="fill-[#f5c518] text-[#f5c518]" size={28} />
              {commonRating}
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">Movie Collection</h2>
            <p className="text-sm text-[#b8b8b8] mt-1">Manage titles, release years, and content ratings</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-md border border-white/10 bg-white/5 p-1 sm:flex">
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex h-10 w-10 items-center justify-center rounded text-sm transition ${
                  viewMode === 'list' ? 'bg-[#f5c518] text-black' : 'text-[#b8b8b8] hover:text-white'
                }`}
                aria-label="List detail view"
                title="List detail"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`inline-flex h-10 w-10 items-center justify-center rounded text-sm transition ${
                  viewMode === 'grid' ? 'bg-[#f5c518] text-black' : 'text-[#b8b8b8] hover:text-white'
                }`}
                aria-label="Medium icon grid view"
                title="Medium icon grid"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {!showForm && (
              <button
                onClick={handleAddMovie}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#f5c518] hover:bg-[#ddb00f] text-black font-extrabold transition"
              >
                <Plus size={18} />
                Add Movie
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="mb-8 bg-[#121212] border border-white/10 rounded-lg p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold">
                  {editingMovie ? 'Edit Movie' : 'Create Movie'}
                </h3>
                <p className="text-sm text-[#b8b8b8] mt-1">
                  {editingMovie ? 'Update movie information' : 'Add a new movie to your collection'}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMovie(null);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10 text-[#b8b8b8] transition"
                aria-label="Close movie form"
              >
                <X size={18} />
              </button>
            </div>

            <MovieForm
              key={editingMovie?.id || 'new-movie'}
              initialData={editingMovie || undefined}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}

        <div className="bg-[#121212] border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-black/30">
          {isLoading ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center gap-3 text-[#b8b8b8]">
                <div className="w-4 h-4 border-2 border-[#f5c518]/30 border-t-[#f5c518] rounded-full animate-spin" />
                Loading movies...
              </div>
            </div>
          ) : movies.length === 0 ? (
            <div className="p-20 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <Film className="text-[#f5c518]" size={28} />
                </div>

                <h3 className="text-xl font-semibold mb-2">No movies yet</h3>
                <p className="text-[#b8b8b8] text-sm leading-relaxed">
                  Start building your collection by adding your first movie.
                </p>
              </div>
            </div>
          ) : (
            viewMode === 'list' ? (
              <MovieTable movies={movies} onEdit={handleEditMovie} onDelete={handleDeleteMovie} />
            ) : (
              <MovieGrid movies={movies} onEdit={handleEditMovie} onDelete={handleDeleteMovie} />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
