import React, { useState, useEffect } from "react";
import '../styles/App.css';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

interface DailyForecast {
  date: string;
  icon: string;
  avgtemp_c: number;
}



interface ForecastCardProps {
  data?:    DailyForecast;
}


const ForecastCard: React.FC<ForecastCardProps> = ({ data }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);

  const [error, setError] = useState("");
  const [, setSelectedCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);




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
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${cityOnly}&days=10`
    );
    if (!res.ok) throw new Error("City not found or API error");

    const fetchedData = await res.json();

    const forecast: DailyForecast[] = fetchedData.forecast.forecastday.map(
      (day: any) => ({
        date: day.date,
        icon: day.day.condition.icon,
        avgtemp_c: day.day.avgtemp_c
      })
    );

    setForecast(forecast);
    setCity(cityOnly);
    setSelectedCity(cityOnly);
    setSuggestions([]);
    setIsEditing(false);
    setError("");
  } catch (err: any) {
    setError(err.message);
    setForecast(null);
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
          
        </div>
      )}


      {error && <p style={{ color: "red" }}>{error}</p>}
      

     {forecast && (
  <div className="forecast-days">
    {forecast.map((day, index) => (
      <div key={index} className="forecast-day flex flex-col items-center">
        <p className="forecast-date">
  {new Date(day.date).toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
  })}
</p>

        <img src={day.icon} alt="weather icon" className="forecast-icon" />
        <p className="forecast-temp">{day.avgtemp_c}°C</p>
      </div>
    ))}
  </div>
)}


    </div>
  );
};

export default ForecastCard;
