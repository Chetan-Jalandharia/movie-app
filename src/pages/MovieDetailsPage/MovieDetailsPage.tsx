import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieDetails } from '../../types/movie';
import { getMovieById, getPosterUrl } from '../../services/movieService';
import { useFavorites } from '../../hooks/useFavorites';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import styles from './MovieDetailsPage.module.css';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type,
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!movie) {
    return <div className={styles.error}>Movie not found</div>;
  }

  return (
    <div className={styles.detailsPage}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back
      </button>
      
      <div className={styles.movieDetails}>
        <div className={styles.posterContainer}>
          <img 
            src={getPosterUrl(movie.Poster)} 
            alt={`${movie.Title} poster`}
            className={styles.poster}
          />
          <div className={styles.favoriteButtonContainer}>
            <div className={styles.favoriteButtonWrapper}>
              <FavoriteButton 
                isFavorite={isFavorite(movie.imdbID)} 
                onClick={handleToggleFavorite}
              />
              <span>
                {isFavorite(movie.imdbID) ? 'Remove from favorites' : 'Add to favorites'}
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.infoContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>{movie.Title}</h1>
            <div className={styles.meta}>
              <span>{movie.Year}</span>
              <span>•</span>
              <span>{movie.Runtime}</span>
              <span>•</span>
              <span>{movie.Rated}</span>
            </div>
          </div>
          
          <div className={styles.genres}>
            {movie.Genre.split(',').map(genre => (
              <span key={genre} className={styles.genre}>{genre.trim()}</span>
            ))}
          </div>

          {movie.imdbRating !== 'N/A' && (
            <div className={styles.rating}>
              <span className={styles.imdbRating}>{movie.imdbRating}</span>/10
            </div>
          )}

          <div className={styles.section}>
            <h2>Plot</h2>
            <p>{movie.Plot}</p>
          </div>
          
          <div className={styles.section}>
            <h2>Director</h2>
            <p>{movie.Director}</p>
          </div>

          <div className={styles.section}>
            <h2>Cast</h2>
            <p>{movie.Actors}</p>
          </div>

          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className={styles.section}>
              <h2>Ratings</h2>
              <div className={styles.ratings}>
                {movie.Ratings.map((rating, index) => (
                  <div key={index} className={styles.ratingItem}>
                    <div className={styles.ratingSource}>{rating.Source}</div>
                    <div className={styles.ratingValue}>{rating.Value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;