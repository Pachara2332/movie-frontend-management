import React from 'react';
import { Film, Pencil, Trash2 } from 'lucide-react';
import type { Movie } from '../../types/movie.types';

interface MovieGridProps {
  movies: Movie[];
  canDelete: boolean;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, canDelete, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
      {movies.map((movie) => (
        <article
          key={movie.id}
          className="group overflow-hidden rounded-lg border border-white/10 bg-black transition hover:-translate-y-1 hover:border-[#f5c518]/40"
        >
          <div className="aspect-[2/3] overflow-hidden bg-white/[0.04]">
            {movie.imageUrl ? (
              <img src={movie.imageUrl} alt={movie.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#f5c518]">
                <Film size={42} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#8f8f8f]">No image</span>
              </div>
            )}
          </div>

          <div className="space-y-4 p-4">
            <div>
              <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-white">{movie.title}</h3>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#b8b8b8]">{movie.yearReleased}</span>
                <span className="rounded-md border border-[#f5c518]/30 bg-[#f5c518]/10 px-2 py-1 text-xs font-extrabold text-[#f5c518]">
                  {movie.rating}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(movie)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-[#e6e6e6] transition hover:border-[#f5c518]/50 hover:text-[#f5c518]"
              >
                <Pencil size={15} />
                Edit
              </button>
              {canDelete && (
                <button
                  onClick={() => onDelete(movie.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                  aria-label={`Delete ${movie.title}`}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default MovieGrid;
