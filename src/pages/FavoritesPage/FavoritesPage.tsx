import { useState, useMemo } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./FavoritesPage.module.css";

const ITEMS_PER_PAGE = 10;

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter favorites based on search term
  const filteredFavorites = useMemo(() => {
    if (!searchTerm) return favorites;
    return favorites.filter((movie) =>
      movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favorites, searchTerm]);

  // Get current page favorites
  const currentFavorites = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFavorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFavorites, currentPage]);

  // Reset to page 1 when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (movie: any) => {
    removeFavorite(movie.imdbID);
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Favorites</h1>
        <p className={styles.subtitle}>Your collection of favorite movies</p>

        {favorites.length > 0 && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
        )}
      </div>

      <div className={styles.content}>
        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💔</span>
            <h2>No favorite movies yet</h2>
            <p>
              Find movies you love and add them to your favorites collection
            </p>
          </div>
        ) : (
          <>
            {filteredFavorites.length === 0 ? (
              <div className={styles.noResults}>
                <p>No movies found matching "{searchTerm}"</p>
              </div>
            ) : (
              <>
                <MovieGrid
                  movies={currentFavorites}
                  favorites={favorites.map((movie) => movie.imdbID)}
                  onToggleFavorite={handleToggleFavorite}
                />
                
                {filteredFavorites.length > ITEMS_PER_PAGE && (
                  <Pagination 
                    currentPage={currentPage}
                    totalResults={filteredFavorites.length}
                    resultsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
