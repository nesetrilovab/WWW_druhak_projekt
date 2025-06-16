import { useNavigate} from "react-router-dom";
import { useState } from "react";
import ForecastCard from "./components/ForecastCard";
import "./styles/App.css"


function ForecastPage() {
  const [cards, setCards] = useState<number[]>([Date.now()]);
  const navigate = useNavigate();

  const addCard = () => {
    setCards(prev => [...prev, Date.now()]);
  };

  return (
    <div className="app">
      <header>
        <h1>🌤️ Daily Forecast Compare</h1>
        <div className="controls">
          <button onClick={addCard}>➕ Add Card</button>
<button onClick={() => navigate("/")}>
          ⬅ Back to Main
        </button>        </div>
      </header>

      <main className="cards-container">
        {cards.map((id) => (
          <ForecastCard key={id} />
        ))}
      </main>
    </div>
  );
}



export default ForecastPage;
