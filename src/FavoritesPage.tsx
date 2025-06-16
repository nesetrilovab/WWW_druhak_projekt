import React, { useEffect, useState } from "react";
import { getFavorites } from "./utils/localStorage";
import type { Favorite } from "./utils/localStorage";
import { useNavigate } from "react-router-dom";
import FavoriteCard from "./components/FavoritesCard";
import type { WeatherApiResponse } from "../types"

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const FavoritesPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherApiResponse>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeatherForFavorites = async () => {
      const favorites: Favorite[] = getFavorites();

      if (favorites.length === 0) {
        setWeatherData([]);
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          favorites.map(async (fav) => {
            const res = await fetch(
              `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${fav.name}&days=1&aqi=no&alerts=yes`
            );
            if (!res.ok) throw new Error(`Failed for ${fav.name}`);
            return await res.json();
          })
        );
        setWeatherData(results);
        setError("");
      } catch (err: any) {
        setError("Failed to fetch weather data.");
        console.error("Favorites fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForFavorites();
  }, []);
  return (
    <div className="app">
      <header>
        <h1>Favorites</h1>
        <div className="controls">
          <button onClick={() => navigate("/")}>
            ⬅ Back to Main
          </button>
        </div>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && weatherData.length === 0 && <p>No favorites found.</p>}

      <div className="favorites-grid">
        {weatherData.map((data, index) => (
          <FavoriteCard key={index} data={data} />
        ))}
      </div>
    </div>
  );

};

export default FavoritesPage;
