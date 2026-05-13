import React, { useState } from 'react';
import { ImagePlus, Save, Upload } from 'lucide-react';
import { getApiErrorMessage } from '../../lib/api-error';
import { movieService } from '../../services/movie.service';
import type { CreateMovieInput, Movie, MovieRating } from '../../types/movie.types';

interface MovieFormProps {
  initialData?: Movie;
  onSubmit: (movie: Movie) => void;
}

const RATING_OPTIONS: MovieRating[] = ['G', 'PG', 'M', 'MA', 'R'];

const fieldClass =
  'w-full h-11 rounded-md border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-[#737373] focus:border-[#f5c518]/70 focus:ring-2 focus:ring-[#f5c518]/20 disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'mb-2 block text-xs font-bold uppercase tracking-wider text-[#b8b8b8]';

const MovieForm: React.FC<MovieFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<CreateMovieInput>(() => ({
    title: '',
    yearReleased: new Date().getFullYear(),
    rating: 'PG',
    ...(initialData && {
      title: initialData.title,
      yearReleased: initialData.yearReleased,
      rating: initialData.rating,
    }),
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearReleased' ? parseInt(value, 10) : value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      setPreviewUrl(initialData?.imageUrl || null);
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const savedMovie = initialData
        ? await movieService.update(initialData.id, formData)
        : await movieService.create(formData);

      const result = selectedImage
        ? await movieService.uploadImage(savedMovie.id, selectedImage)
        : savedMovie;

      onSubmit(result);

      if (!initialData) {
        setFormData({
          title: '',
          yearReleased: new Date().getFullYear(),
          rating: 'PG',
        });
        setSelectedImage(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save movie'));
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={fieldClass}
            placeholder="Inception"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="yearReleased" className={labelClass}>
            Year Released
          </label>
          <input
            id="yearReleased"
            type="number"
            name="yearReleased"
            min="1888"
            max={currentYear + 1}
            value={formData.yearReleased}
            onChange={handleChange}
            required
            className={fieldClass}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="rating" className={labelClass}>
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className={fieldClass}
            disabled={isLoading}
          >
            {RATING_OPTIONS.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="movieImage" className={labelClass}>
            Movie Image
          </label>

          <div className="grid gap-4 rounded-lg border border-dashed border-white/15 bg-black/60 p-4 md:grid-cols-[140px_1fr]">
            <div className="aspect-[2/3] overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
              {previewUrl ? (
                <img src={previewUrl} alt={formData.title || 'Movie poster preview'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#737373]">
                  <ImagePlus size={28} />
                  <span className="text-xs font-semibold">Poster</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-3">
              <p className="text-sm font-semibold text-white">Upload poster or movie artwork</p>
              <p className="text-xs leading-5 text-[#8f8f8f]">
                JPEG, PNG, WebP, or GIF artwork displays across list and grid views.
              </p>

              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#e6e6e6] transition hover:border-[#f5c518]/50 hover:text-[#f5c518]">
                <Upload size={16} />
                Choose image
                <input
                  id="movieImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="sr-only"
                />
              </label>

              {selectedImage && (
                <span className="text-xs text-[#b8b8b8]">
                  Selected: {selectedImage.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md bg-[#f5c518] px-5 py-3 text-sm font-extrabold text-black transition hover:bg-[#ddb00f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {isLoading ? 'Saving...' : initialData ? 'Update Movie' : 'Create Movie'}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
