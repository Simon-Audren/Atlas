import React, { useState } from "react";

function Calculator() {
  const [result, setResult] = useState(0);
  const [result2, setResult2] = useState(0);
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");
  const [difference, setDifference] = useState(0);
  const [reciproque, setReciproque] = useState(0);
  const [sensibilite, setSensibilite] = useState(10);
  const [rightAnswer, setRightAnswer] = useState([0, 0]);

  // Fonction de transformation géométrique de l'ELO
  const transformElo = (elo) => {
    if (elo >= 100) return elo;  // Pour les valeurs >= 100, on garde l'ELO réel
    const plancher = 50; // Valeur plancher
    const compression = 2; // Facteur de compression
    const activation = 100; // Seuil à partir duquel s'active la fonction géométrique
    return Math.round(plancher * Math.pow(compression, elo / activation)); // Transformation géométrique
  };

  const handleInputChange1 = (e) => setInput(e.target.value);
  const handleInputChange2 = (e) => setInput2(e.target.value);

  const calculate = (winner) => {
    try {
      const num1 = parseFloat(input);
      const num2 = parseFloat(input2);

      if (!isNaN(num1) && !isNaN(num2)) {
        let differenceValue = num1 - num2;
        if (differenceValue > 400) {
          differenceValue = 400;
        }
        if (differenceValue < -400) {
          differenceValue = -400;
        }
        setDifference(differenceValue);

        let reciproqueValue = 1 / (1 + Math.pow(10, -differenceValue / 400));
        reciproqueValue = Math.round(reciproqueValue * 100) / 100;
        setReciproque(reciproqueValue);

        const rightAnswer = winner === "first" ? [1, 0] : [0, 1];
        setRightAnswer(rightAnswer);

        const nbQuestions = 20;
        let sensibiliteValue = -100 / (1 + Math.exp(-0.1 * nbQuestions))+110;
        setSensibilite(sensibiliteValue); 

        const newResult1 = Math.round(num1 + sensibiliteValue * (rightAnswer[0] - reciproqueValue));
        const newResult2 = Math.round(num2 + sensibiliteValue * (rightAnswer[1] - (1 - reciproqueValue)));

        setResult(newResult1);
        setResult2(newResult2);
      } else {
        setResult("Erreur : Entrez des nombres valides");
        setResult2("Erreur : Entrez des nombres valides");
      }
    } catch (error) {
      setResult("Erreur de calcul");
      setResult2("Erreur de calcul");
    }
  };

  return (
    <div>
      <h2>Calculatrice</h2>
      <input
        type="number"
        value={input}
        onChange={handleInputChange1}
        placeholder="Entrez un nombre"
      />
      <input
        type="number"
        value={input2}
        onChange={handleInputChange2}
        placeholder="Entrez un autre nombre"
      />

      <div>
        <button className="box" onClick={() => calculate("first")}>
          Win 1
        </button>
        <span> . </span>
        <button className="box" onClick={() => calculate("second")}>
          Win 2
        </button>
      </div>

      <div>
        <h3>Premier résultat : {transformElo(result)} </h3>
        <h3>Deuxième résultat : {transformElo(result2)} </h3>
        <h3>Différence : {difference}</h3>
        <h3>Réciproque : {reciproque}</h3>
        <h3>Sensibilité : {sensibilite}</h3>
        <h3>Gagnant : {rightAnswer[0] === 1 ? "Premier" : rightAnswer[1] === 1 ? "Deuxième" : "Aucun"}</h3>
      </div>
    </div>
  );
}

export default Calculator;
