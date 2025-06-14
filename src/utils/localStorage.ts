// src/utils/localStorage.ts

const FAVORITES_KEY = "weatherAppFavorites";

export const getFavorites = (): { name: string }[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveFavorites = (favs: { name: string }[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
};

export const addFavorite = (city: { name: string }) => {
  const current = getFavorites();
  if (!current.find(f => f.name === city.name)) {
    current.push(city);
    saveFavorites(current);
  }
};

export const removeFavorite = (cityName: string) => {
  const updated = getFavorites().filter(f => f.name !== cityName);
  saveFavorites(updated);
};
