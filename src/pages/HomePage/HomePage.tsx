import { useState, useCallback } from 'react';
import { MovieSummary } from '../../types/movie';
import { useFavorites } from '../../hooks/useFavorites';
import { searchMovies } from '../../services/movieService';
import SearchBar from '../../components/SearchBar/SearchBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const data = await searchMovies(query);
      setMovies(data.Search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching movies');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleFavorite = useCallback((movie: MovieSummary) => {
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return (
    <div className={styles.homePage}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Discover Movies</h1>
        <p className={styles.heroSubtitle}>
          Search for your favorite movies and add them to your collection
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className={styles.content}>
        {isLoading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Searching for movies...</p>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {!isLoading && !error && searchPerformed && (
          <>
            {movies.length > 0 ? (
              <div className={styles.results}>
                <h2 className={styles.resultsTitle}>
                  Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
                </h2>
                <MovieGrid 
                  movies={movies} 
                  favorites={favorites.map(f => f.imdbID)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ) : (
              <div className={styles.noResults}>
                <h2>No movies found</h2>
                <p>Try searching for a different movie title</p>
              </div>
            )}
          </>
        )}

        {!searchPerformed && !isLoading && (
          <div className={styles.initialState}>
            <span className={styles.searchIcon}>🔍</span>
            <p>Search for a movie to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;