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
  data?: WeatherData; // optional, passed in Favorites page
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  // Local state for main page search
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Favorites star state
  const [isFavorite, setIsFavorite] = useState(false);

  // Use the data prop (favorites) or internal weather state (main)
  const weatherToShow = data || weather;

  // On mount or when city changes, check if favorite
  useEffect(() => {
    const nameToCheck = data?.location.name || selectedCity;
    if (!nameToCheck) return;
    const favorites = getFavorites();
    setIsFavorite(favorites.some(fav => fav.name === nameToCheck));
  }, [data, selectedCity]);

  // Search handler for main page only (skip if data is passed)
  const handleSearch = async (input?: string) => {
    if (data) return; // don't search on favorites cards

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
      setCity(cityOnly); // Show the city in the input field
      setSelectedCity(cityOnly);
      setSuggestions([]);
      setIsEditing(false);
      setError("");
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    }
  };

  // Fetch city suggestions for main page only
  useEffect(() => {
    if (data) return; // no suggestions on favorites cards

    const delay = setTimeout(() => {
      if (city.trim()) {
        fetchCitySuggestions(city);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [city, data]);

  const fetchCitySuggestions = async (query: string) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${query}`
      );

      if (!res.ok) throw new Error("City search error");

      const data = await res.json();

      const results = data.map(
        (place: any) => `${place.name}, ${place.country}`
      );

      setSuggestions(results);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      setSuggestions([]);
    }
  };

  // Toggle favorite star on both main and favorites page
  const toggleFavorite = () => {
    if (!weatherToShow) return;
    const cityName = weatherToShow.location.name;
    if (isFavorite) {
      removeFavorite(cityName);
      setIsFavorite(false);
    } else {
      addFavorite({ name: cityName });
      setIsFavorite(true);
    }
  };

  return (
    <div className="weather-card">
  {/* Show input and search only if NOT favorites card (no data prop) */}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(city);
            }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setTimeout(() => setIsEditing(false), 150)}
          />
          {isEditing && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSearch(suggestion)}
                >
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

  {/* If favorites card (has data) show star without search, still toggleable */}
  {data && (
    <button
      className="fav-btn"
      onClick={toggleFavorite}
      style={{ color: isFavorite ? "gold" : "gray", fontSize: "24px" }}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      ★
    </button>
  )}

  {error && <p style={{ color: "red" }}>{error}</p>}

  {weatherToShow && (
    <div className="weather-grid">
      <div className="weather-col">
        <p>
          <strong>🌍 Timezone:</strong> {weatherToShow.location.tz_id}
        </p>
        <p>
          <strong>🌡 Temp:</strong> {weatherToShow.current.temp_c}°C
        </p>
        <p>
          <strong>💨 Wind:</strong> {weatherToShow.current.wind_kph} kph
        </p>
        <p>
          <strong>💧 Humidity:</strong> {weatherToShow.current.humidity}%
        </p>
      </div>
      <div className="weather-col">
        <p>
          <strong>🌤 Condition:</strong> {weatherToShow.current.condition.text}
        </p>
        <p>
          <strong>🥵 Feels Like:</strong> {weatherToShow.current.feelslike_c}°C
        </p>
        <p>
          <strong>💨 Gust:</strong> {weatherToShow.current.gust_kph} kph
        </p>
        <p>
          <strong>☀️ UV Index:</strong> {weatherToShow.current.uv}
        </p>
      </div>
    </div>
  )}
</div>

  );
};

export default WeatherCard;
