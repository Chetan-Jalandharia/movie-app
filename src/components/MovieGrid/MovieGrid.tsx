import { MovieSummary } from '../../types/movie';
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: MovieSummary[];
  favorites: string[];
  onToggleFavorite: (movie: MovieSummary) => void;
}

const MovieGrid = ({ movies, favorites, onToggleFavorite }: MovieGridProps) => {
  if (!movies.length) {
    return <p className={styles.noResults}>No movies found</p>;
  }

  return (
    <div className={styles.grid}>
      {movies.map(movie => (
        <div key={movie.imdbID} className={styles.gridItem}>
          <MovieCard 
            movie={movie}
            isFavorite={favorites.includes(movie.imdbID)}
            onToggleFavorite={() => onToggleFavorite(movie)}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;