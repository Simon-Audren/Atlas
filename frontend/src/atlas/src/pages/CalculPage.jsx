import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import Calculator from "../Calcul.jsx";

function CalculPage() {
  const [elo, setElo] = useState(null);

  // Fonction pour appeler l'API backend
  async function updateElo(user1_id, user2_id, winner) {
    try {
      const response = await fetch("http://localhost:3001/update-elo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1_id, user2_id, winner }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'ELO");
      }

      const data = await response.json();
      setElo(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  // Simuler un appel API au clic (exemple)
  const handleEloUpdate = () => {
    updateElo("user1_id_example", "user2_id_example", "first");
  };

  return (
    <>
      <Navbar />
      <h1>Bienvenue sur Atlas !</h1>
      <Calculator />
      <div className="container">
        <a href="/solo" className="box">Solo</a>
        <a href="/multijoueur" className="box">Multijoueur</a>
      </div>
      <button onClick={handleEloUpdate}>Mettre à jour l'ELO</button>
      {elo && (
        <div>
          <p>Nouveau ELO Joueur 1: {elo.user1_elo}</p>
          <p>Nouveau ELO Joueur 2: {elo.user2_elo}</p>
        </div>
      )}
    </>
  );
}

export default CalculPage;
