import { useState } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import styles from "./FavoritesPage.module.css";

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFavorites = searchTerm
    ? favorites.filter((movie) =>
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favorites;

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <MovieGrid
                movies={filteredFavorites}
                favorites={favorites.map((movie) => movie.imdbID)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
