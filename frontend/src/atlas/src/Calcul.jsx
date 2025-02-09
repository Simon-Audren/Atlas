import React, { useState } from "react";

function Calculator() {
  const [result, setResult] = useState(0); // Résultat du premier nombre
  const [result2, setResult2] = useState(0); // Résultat du deuxième nombre
  const [input, setInput] = useState(""); // Valeur du premier nombre
  const [input2, setInput2] = useState(""); // Valeur du deuxième nombre
  const [difference, setDifference] = useState(0); // Différence entre les deux nombres
  const [reciproque, setReciproque] = useState(0); // Calcul du réciproque

  const handleInputChange1 = (e) => {
    setInput(e.target.value); // Mise à jour du premier nombre
  };

  const handleInputChange2 = (e) => {
    setInput2(e.target.value); // Mise à jour du deuxième nombre
  };

  const calculate = () => {
    try {
      const num1 = parseFloat(input);
      const num2 = parseFloat(input2);
      
      if (!isNaN(num1) && !isNaN(num2)) {
        // Calculs
        const diff = num1 - num2; // Différence
        setDifference(diff); // Mettre à jour la différence
        const reciproqueValue = 1 / (1 + Math.pow(10, -diff / 400)); // Calcul du réciproque
        setReciproque(reciproqueValue); // Mettre à jour le réciproque
        setResult(num1 + 20*(1-reciproqueValue));  // Augmenter de 7 le premier nombre
        setResult2(num2 + 20*(0-(1-reciproqueValue))); // Diminuer de 7 le deuxième nombre

        
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
      <button onClick={calculate}>Calculer</button>
      <div>
        <h3>Premier résultat : {result} ({20*(1-reciproque)})</h3>
        <h3>Deuxième résultat : {result2} ({20*(0-(1-reciproque))})</h3>
        <h3>Différence : {difference}</h3>
        <h3>Réciproque : {reciproque}</h3>
      </div>
    </div>
  );
}

export default Calculator;
