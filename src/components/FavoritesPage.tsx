import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WeatherCard from "./WeatherCard";
import { getFavorites } from "../utils/localStorage"; // you'll create this

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<{ name: string }[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getFavorites();
    setFavorites(stored);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        favorites.map(async (fav) => {
          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=${fav.name}`
          );
          return res.json();
        })
      );
      setWeatherData(results);
    };

    if (favorites.length > 0) {
      fetchData();
    }
  }, [favorites]);

  return (
    <div className="app">
      <header>
        <h1>⭐ Favorite Locations</h1>
        <button onClick={() => navigate("/")}>⬅ Back to Main Page</button>
      </header>
      <main className="cards-container">
        {weatherData.map((data, idx) => (
          <WeatherCard key={idx} data={data} />
        ))}
      </main>
    </div>
  );
};

export default FavoritesPage;
