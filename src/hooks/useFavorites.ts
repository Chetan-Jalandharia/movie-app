import { useState, useEffect, useCallback } from 'react';
import { MovieSummary } from '../types/movie';
import { getStorageItem, setStorageItem } from '../utils/localStorage';

const FAVORITES_KEY = 'movieApp.favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<MovieSummary[]>(() => 
    getStorageItem<MovieSummary[]>(FAVORITES_KEY, [])
  );

  useEffect(() => {
    setStorageItem(FAVORITES_KEY, favorites);
  }, [favorites]);

  const addFavorite = useCallback((movie: MovieSummary) => {
    setFavorites(prev => {
      if (prev.some(m => m.imdbID === movie.imdbID)) {
        return prev;
      }
      return [...prev, movie];
    });
  }, []);

  const removeFavorite = useCallback((imdbId: string) => {
    setFavorites(prev => prev.filter(movie => movie.imdbID !== imdbId));
  }, []);

  const isFavorite = useCallback((imdbId: string) => {
    return favorites.some(movie => movie.imdbID === imdbId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};