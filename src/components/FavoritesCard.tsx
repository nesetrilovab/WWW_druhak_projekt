import React, { useEffect, useState } from "react";
import { addFavorite, removeFavorite, getFavorites } from "../utils/localStorage";

interface WeatherData {
  location: {
    name: string;
    tz_id: string;
  };
  current: {
    temp_c: number;
    wind_kph: number;
    humidity: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    gust_kph: number;
    uv: number;
  };
}

type Favorite = { name: string };

const FavoriteCard: React.FC<{ data: WeatherData }> = ({ data }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites: Favorite[] = getFavorites();
    const isFav = favorites.some((fav) => fav.name === data.location.name);
    setIsFavorite(isFav);
  }, [data]);

  const toggleFavorite = () => {
    const cityName = data.location.name;
    if (isFavorite) {
      removeFavorite(cityName);
    } else {
      addFavorite({ name: cityName });
    }

    const updatedFavorites = getFavorites();
    const nowFavorite = updatedFavorites.some((fav) => fav.name === cityName);
    setIsFavorite(nowFavorite);
  };

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h2 className="weather-card-title">{data.location.name}</h2>
        <button
          className="fav-btn"
          onClick={toggleFavorite}
          style={{ color: isFavorite ? "gold" : "gray" }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          ★
        </button>
      </div>
      <div className="weather-grid">
        <div className="weather-col">
          <p><strong>🌍 Timezone:</strong> {data.location.tz_id}</p>
          <p><strong>🌡 Temp:</strong> {data.current.temp_c}°C</p>
          <p><strong>💨 Wind:</strong> {data.current.wind_kph} kph</p>
          <p><strong>💧 Humidity:</strong> {data.current.humidity}%</p>
        </div>
        <div className="weather-col">
          <p><strong>🌤 Condition:</strong> {data.current.condition.text}</p>
          <p><strong>🥵 Feels Like:</strong> {data.current.feelslike_c}°C</p>
          <p><strong>💨 Gust:</strong> {data.current.gust_kph} kph</p>
          <p><strong>☀️ UV Index:</strong> {data.current.uv}</p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
