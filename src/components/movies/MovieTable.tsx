import React from 'react';
import { Film, Pencil, Trash2 } from 'lucide-react';
import type { Movie } from '../../types/movie.types';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="border-b border-white/10 bg-white/[0.03]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#f5c518]">
              Movie
            </th>
            <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#f5c518]">
              Year
            </th>
            <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#f5c518]">
              Rating
            </th>
            <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-[#f5c518]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {movies.map((movie) => (
            <tr key={movie.id} className="transition hover:bg-white/[0.04]">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                    {movie.imageUrl ? (
                      <img src={movie.imageUrl} alt={movie.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#f5c518]">
                        <Film size={20} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-white">{movie.title}</div>
                    <div className="mt-1 text-xs text-[#8f8f8f]">Movie ID #{movie.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-[#d8d8d8]">{movie.yearReleased}</td>
              <td className="px-6 py-4">
                <span className="inline-flex min-w-10 items-center justify-center rounded-md border border-[#f5c518]/30 bg-[#f5c518]/10 px-2.5 py-1 text-xs font-extrabold text-[#f5c518]">
                  {movie.rating}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(movie)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[#e6e6e6] transition hover:border-[#f5c518]/50 hover:text-[#f5c518]"
                    aria-label={`Edit ${movie.title}`}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(movie.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                    aria-label={`Delete ${movie.title}`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
