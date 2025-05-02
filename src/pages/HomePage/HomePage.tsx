import { useState, useCallback, useEffect } from 'react';
import { MovieSummary } from '../../types/movie';
import { useFavorites } from '../../hooks/useFavorites';
import { searchMovies } from '../../services/movieService';
import SearchBar from '../../components/SearchBar/SearchBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import Pagination from '../../components/Pagination/Pagination';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleSearch = useCallback(async (query: string) => {
    setCurrentQuery(query);
    setCurrentPage(1);
    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const data = await searchMovies(query, 1);
      setMovies(data.Search);
      setTotalResults(parseInt(data.totalResults));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching movies');
      setMovies([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePageChange = useCallback(async (page: number) => {
    if (page === currentPage || !currentQuery) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchMovies(currentQuery, page);
      setMovies(data.Search);
      setCurrentPage(page);
      // We don't update totalResults here as it should remain consistent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the page');
    } finally {
      setIsLoading(false);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, currentQuery]);

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
        <SearchBar onSearch={handleSearch} initialQuery={currentQuery} />
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
                  Found {totalResults} movie{totalResults !== 1 ? 's' : ''}
                </h2>
                <MovieGrid 
                  movies={movies} 
                  favorites={favorites.map(f => f.imdbID)}
                  onToggleFavorite={handleToggleFavorite}
                />
                
                {totalResults > 10 && (
                  <Pagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    onPageChange={handlePageChange}
                  />
                )}
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