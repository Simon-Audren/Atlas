import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import { createClient } from "@supabase/supabase-js";
import "./Solo.css"; // Import du CSS

function Home() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [elo, setElo] = useState(null);
  const [newElo, setNewElo] = useState(null); // Nouvel ELO après mise à jour

  // Instance Supabase
  const supabase = createClient(
    "https://aacunbvqmdakdllmzman.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3VuYnZxbWRha2RsbG16bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjMzOTUsImV4cCI6MjA1MTgzOTM5NX0.KH7rWXtBSYkmbYAYdWcsMy9cq1-aoPmq-MIIkLaOAWI"
  );

  useEffect(() => {
    fetchRandomQuestion();
    fetchElo();
  }, []);

  async function fetchRandomQuestion() {
    setLoading(true);
    setSelectedAnswer(null);
    setCorrectAnswerIndex(null);

    const { data, error } = await supabase.from("questions").select("*").gte("elo", 1180).lte("elo", 1190);
console.log(data)
    if (error) {
        console.error("Erreur:", error);
    } else {
        // 1. Attribuer la même probabilité à chaque question
        const equalProbability = 1 / data.length;  // Chaque question a la même probabilité

        // 2. Créer un tableau des probabilités égales pour chaque question
        const probabilities = data.map((question) => ({
            question: question,
            probability: equalProbability,
        }));

        // 3. Normaliser les probabilités (pour que la somme fasse 1)
        const totalProbability = probabilities.reduce((sum, probObj) => sum + probObj.probability, 0);
        probabilities.forEach((probObj) => {
            probObj.normalizedProbability = probObj.probability / totalProbability;
        });

        // 4. Générer un tirage basé sur les probabilités normalisées
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        let selectedQuestion = null;

        for (const probObj of probabilities) {
            cumulativeProbability += probObj.normalizedProbability;
            if (randomValue <= cumulativeProbability) {
                selectedQuestion = probObj.question;
                break;
            }
        }

        // 5. Mettre à jour l'état avec la question sélectionnée
        setQuestion(selectedQuestion);

        const allAnswers = [
            selectedQuestion.correct_answer,
            selectedQuestion.wrong_answer_1,
            selectedQuestion.wrong_answer_2,
            selectedQuestion.wrong_answer_3,
            selectedQuestion.wrong_answer_4,
            selectedQuestion.wrong_answer_5,
        ];

        const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
        setAnswers(shuffledAnswers);

        // Stocke l'index de la bonne réponse après mélange
        setCorrectAnswerIndex(shuffledAnswers.indexOf(selectedQuestion.correct_answer));
    }
    setLoading(false);
}


  

  async function fetchElo() {
    try {
      const user = await supabase.auth.getUser();
      if (!user || !user.data || !user.data.user) {
        console.error("Utilisateur non connecté");
        return;
      }

      const userId = user.data.user.id;
      const { data, error } = await supabase
        .from("users")
        .select("elo")
        .eq("google_id", userId)
        .single();

      if (error) {
        console.error("Erreur récupération ELO:", error);
        return;
      }

      setElo(data.elo);
    } catch (err) {
      console.error("Erreur inattendue lors de la récupération de l'ELO:", err);
    }
  }

  async function updateElo(won) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData || !userData.user) {
            console.error("Utilisateur non trouvé:", userError);
            return;
        }

        const userId = userData.user.id; // Récupération de l'ID de l'utilisateur

        if (!question || question.elo === undefined) {
            console.error("ELO de la question non disponible");
            return;
        }

        // Récupération de l'ELO du joueur
        const { data, error } = await supabase
            .from("users")
            .select("elo")
            .eq("google_id", userId)
            .single();

        if (error || !data) {
            console.error("Erreur récupération ELO du joueur:", error);
            return;
        }

        const playerElo = data.elo; // ELO actuel du joueur
        console.log("Joueur ELO:", playerElo);
        console.log("Question ELO:", question.elo);

        const response = await fetch("http://localhost:3001/calculate-elo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                player1_elo: playerElo,  // ELO du joueur
                player2_elo: question.elo,  // ELO de la question
                winner: won ? "first" : "second",
                userId: userId, // Envoie l'ID de l'utilisateur
                questionId: question.id // Envoie l'ID de la question
            }),
        });

        const responseData = await response.json();
        if (response.ok) {
            console.log("Nouveaux ELO:", responseData);
            setElo(responseData.newElo1); // Met à jour l'affichage du nouvel ELO
        } else {
            console.error("Erreur mise à jour ELO:", responseData.error);
        }
    } catch (error) {
        console.error("Erreur serveur:", error);
    }
}




function handleAnswerClick(index) {
  setSelectedAnswer(index);
  setLoading(true); // Désactive les boutons pendant le traitement

  const isCorrect = index === correctAnswerIndex;
  updateElo(isCorrect); // Mise à jour de l'ELO en fonction de la réponse

  // Attendre 1 seconde avant de charger la prochaine question
  setTimeout(() => {
    fetchRandomQuestion();
  }, 1000);
}



  return (
    <>
      <Navbar />
      <div className="container">
        <a href="/solo" className="box">Solo</a>
        <a href="/multijoueur" className="box">Multijoueur</a>
      </div>

      <div className="elo-container">
        <p><strong>Votre ELO :</strong> {elo !== null ? elo : "Chargement..."}</p>
        {newElo !== null && <p><strong>Nouvel ELO :</strong> {newElo}</p>}
      </div>

      <div className="question-container">
        {question ? (
          <div>
            <p><strong>{question.question_text}</strong></p>
            <div className="answers">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-button 
                    ${selectedAnswer !== null && index === correctAnswerIndex && "correct"}
                    ${selectedAnswer === index && index !== correctAnswerIndex && "incorrect"}`}
                  onClick={() => handleAnswerClick(index)}
                  disabled={loading}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>Chargement de la question...</p>
        )}
      </div>
    </>
  );
}

export default Home;
