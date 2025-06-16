import React, { useState, useEffect } from "react";
import { addFavorite, removeFavorite, getFavorites } from "../utils/localStorage";
import '../styles/App.css';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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

interface WeatherCardProps {
  data?: WeatherData;
}

type Favorite = { name: string };

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const weatherToShow = data || weather;

  // Check if city is favorited
  useEffect(() => {
    const nameToCheck = data?.location.name || selectedCity;
    if (!nameToCheck) return;

    const favorites: Favorite[] = getFavorites();
    const isFav = favorites.some((fav: Favorite) => fav.name === nameToCheck);
    setIsFavorite(isFav);
  }, [data, selectedCity]);

  // Suggest cities while typing
  useEffect(() => {
    if (data) return;

    const delay = setTimeout(() => {
      if (city.trim()) {
        fetchCitySuggestions(city);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [city]);

  const handleSearch = async (input?: string) => {
    if (data) return;

    const cityToSearch = input || city;
    const cityOnly = cityToSearch.split(",")[0].trim();
    if (!cityOnly) return;

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${cityOnly}&days=1&aqi=no&alerts=yes`
      );
      if (!res.ok) throw new Error("City not found or API error");

      const fetchedData: WeatherData = await res.json();
      setWeather(fetchedData);
      setCity(cityOnly);
      setSelectedCity(cityOnly);
      setSuggestions([]);
      setIsEditing(false);
      setError("");
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    }
  };

  const fetchCitySuggestions = async (query: string) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${query}`
      );

      if (!res.ok) throw new Error("City search error");

      const data = await res.json();
      const results = data.map((place: any) => `${place.name}, ${place.country}`);
      setSuggestions(results);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      setSuggestions([]);
    }
  };

  const toggleFavorite = () => {
    if (!weatherToShow) return;
    const cityName = weatherToShow.location.name;

    if (isFavorite) {
      removeFavorite(cityName);
    } else {
      addFavorite({ name: cityName });
    }

    const updatedFavorites: Favorite[] = getFavorites();
    const nowFavorite = updatedFavorites.some((fav: Favorite) => fav.name === cityName);
    setIsFavorite(nowFavorite);
  };

  return (
    <div className="weather-card">
      {!data && (
        <div className="weather-card-header">
          <div className="search-wrapper">
            <div className="search-bar-container">
              <input
                className="weather-card-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch(city)}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setTimeout(() => setIsEditing(false), 150)}
              />
              {isEditing && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onMouseDown={() => handleSearch(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button onClick={() => handleSearch()}>Search</button>
          <button
            className="fav-btn"
            onClick={toggleFavorite}
            style={{ color: isFavorite ? "gold" : "gray" }}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            ★
          </button>
        </div>
      )}

      {data && (
        <div className="weather-card-header">
          <h2 className="weather-card-title">{weatherToShow?.location.name}</h2>
          <button
            className="fav-btn"
            onClick={toggleFavorite}
            style={{ color: isFavorite ? "gold" : "gray" }}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            ★
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherToShow && (
        <div className="weather-grid">
          <div className="weather-col">
            <p><strong>🌍 Timezone:</strong> {weatherToShow.location.tz_id}</p>
            <p><strong>🌡 Temp:</strong> {weatherToShow.current.temp_c}°C</p>
            <p><strong>💨 Wind:</strong> {weatherToShow.current.wind_kph} kph</p>
            <p><strong>💧 Humidity:</strong> {weatherToShow.current.humidity}%</p>
          </div>
          <div className="weather-col">
            <p><strong>🌤 Condition:</strong> {weatherToShow.current.condition.text}</p>
            <p><strong>🥵 Feels Like:</strong> {weatherToShow.current.feelslike_c}°C</p>
            <p><strong>💨 Gust:</strong> {weatherToShow.current.gust_kph} kph</p>
            <p><strong>☀️ UV Index:</strong> {weatherToShow.current.uv}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
