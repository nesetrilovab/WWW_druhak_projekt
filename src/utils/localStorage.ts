const STORAGE_KEY = "weather_favorites";

export type Favorite = { name: string };

export function getFavorites(): Favorite[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) as Favorite[] : [];
}

export function addFavorite(city: Favorite): void {
  const current = getFavorites();
  if (!current.some((c: Favorite) => c.name === city.name)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, city]));
  }
}

export function removeFavorite(name: string): void {
  const updated = getFavorites().filter((c: Favorite) => c.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
