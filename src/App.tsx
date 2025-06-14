import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import FavoritesPage from "./components/FavoritesPage";


function HomePage() {
  const [cards, setCards] = useState<number[]>([Date.now()]);
  const navigate = useNavigate();

  const addCard = () => {
    setCards(prev => [...prev, Date.now()]);
  };

  return (
    <div className="app">
      <header>
        <h1>🌤️ Weather Compare</h1>
        <div className="controls">
          <button onClick={addCard}>➕ Add Card</button>
          <button onClick={() => navigate("/favorites")}>⭐ View Favorites</button>
        </div>
      </header>

      <main className="cards-container">
        {cards.map((id) => (
          <WeatherCard key={id} />
        ))}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
