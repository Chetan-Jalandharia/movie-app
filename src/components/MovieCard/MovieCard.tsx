import { Link } from 'react-router-dom';
import { MovieSummary } from '../../types/movie';
import { getPosterUrl } from '../../services/movieService';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: MovieSummary;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MovieCard = ({ movie, isFavorite, onToggleFavorite }: MovieCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.posterContainer}>
        <img 
          src={getPosterUrl(movie.Poster)} 
          alt={`${movie.Title} poster`}
          className={styles.poster}
        />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title} title={movie.Title}>{movie.Title}</h3>
          <span className={styles.yearBadge}>{movie.Year}</span>
        </div>
        
        <div className={styles.actions}>
          <Link to={`/movie/${movie.imdbID}`} className={styles.detailsButton}>
            More Info
          </Link>
          <FavoriteButton 
            isFavorite={isFavorite} 
            onClick={onToggleFavorite} 
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;