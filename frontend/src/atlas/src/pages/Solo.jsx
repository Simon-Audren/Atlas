import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import { createClient } from "@supabase/supabase-js";
import "./Solo.css"; 

function Home() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [elo, setElo] = useState(null);
  const [newElo, setNewElo] = useState(null); 

  // Instance Supabase
  const supabase = createClient(
    "https://aacunbvqmdakdllmzman.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3VuYnZxbWRha2RsbG16bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjMzOTUsImV4cCI6MjA1MTgzOTM5NX0.KH7rWXtBSYkmbYAYdWcsMy9cq1-aoPmq-MIIkLaOAWI"
  );

  useEffect(() => {
    fetchRandomQuestion();
    fetchElo();
  }, []);

 // Fonction pour la première plage (0 à 0,5)
const calculateValueFirstRange = (x) => {
  return 250 / (1 + Math.exp(-15 * (x - 0.9)));
};

// Fonction pour la deuxième plage (0,5 à 1)
const calculateValueSecondRange = (x) => {
  return (250 / (1 + Math.exp(-15 * (x - 0.1)))) - 250;
};

//Fetch des questions affichées sur le site
async function fetchRandomQuestion() { 
  setLoading(true);
  setSelectedAnswer(null);
  setCorrectAnswerIndex(null);

  try {
      const user = await supabase.auth.getUser();
      if (!user || !user.data || !user.data.user) {
          console.error("Utilisateur non connecté");
          setLoading(false);
          return;
      }

      const userId = user.data.user.id;
      const { data: userData, error: userError } = await supabase
          .from("users")
          .select("elo")
          .eq("google_id", userId)
          .single();

      if (userError) {
          console.error("Erreur récupération ELO:", userError);
          setLoading(false);
          return;
      }

      const userElo = userData.elo;

      // Générer un nombre aléatoire entre 0 et 1 avec 3 chiffres après la virgule
      const randomValue = parseFloat((Math.random()).toFixed(3));
      console.log(randomValue);

      // Appliquer la bonne fonction selon la valeur de randomValue
      let transformedValue;
      if (randomValue <= 0.5) {
          transformedValue = calculateValueSecondRange(randomValue);
      } else {
          transformedValue =  calculateValueFirstRange(randomValue);
      }
      console.log(transformedValue);

      // Calculer minElo et maxElo en fonction de la valeur transformée
      const minElo = Math.round(userElo + transformedValue - 20); // minElo = ELO - (valeur - 10)
      const maxElo = Math.round(userElo + transformedValue + 20); // maxElo = ELO + (valeur + 10)

      console.log(minElo, maxElo);

      // Récupérer les questions dans l'intervalle minElo et maxElo
      let { data: questions, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .gte("elo", minElo)
          .lte("elo", maxElo);

      // Si pas de questions dans l'intervalle, récupérer toutes les questions
      if (questionsError) {
          console.error("Erreur récupération questions:", questionsError);
          setLoading(false);
          return;
      }

      // Si aucune question dans l'intervalle, récupérer toutes les questions disponibles
      if (questions.length === 0) {
          console.log("Aucune question dans l'intervalle, récupération de toutes les questions.");
          const { data: allQuestions, error: allQuestionsError } = await supabase
              .from("questions")
              .select("*");

          if (allQuestionsError) {
              console.error("Erreur récupération de toutes les questions:", allQuestionsError);
              setLoading(false);
              return;
          }

          questions = allQuestions;
      }

      console.log(questions);

      // Calculer les probabilités pour chaque question
      const equalProbability = 1 / questions.length;
      const probabilities = questions.map((question) => {
          const prob = calculateValueFirstRange(question.elo); 
          return {
              question: question,
              probability: prob, 
          };
      });

      // Normaliser les probabilités
      const totalProbability = probabilities.reduce((sum, probObj) => sum + probObj.probability, 0);
      probabilities.forEach((probObj) => {
          probObj.normalizedProbability = probObj.probability / totalProbability;
      });

      // Choisir une question en fonction des probabilités
      const randomSelectionValue = Math.random();
      let cumulativeProbability = 0;
      let selectedQuestion = null;

      for (const probObj of probabilities) {
          cumulativeProbability += probObj.normalizedProbability;
          if (randomSelectionValue <= cumulativeProbability) {
              selectedQuestion = probObj.question;
              break;
          }
      }

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

      setCorrectAnswerIndex(shuffledAnswers.indexOf(selectedQuestion.correct_answer));
  } catch (error) {
      console.error("Erreur inattendue:", error);
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
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData || !userData.user) {
        console.error("Utilisateur non trouvé:", userError);
        return;
      }

      const userId = userData.user.id;

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

      const playerElo = data.elo; 
      console.log("Joueur ELO:", playerElo);
      console.log("Question ELO:", question.elo);

      const response = await fetch("http://localhost:3001/calculate-elo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player1_elo: playerElo,
          player2_elo: question.elo, 
          winner: won ? "first" : "second",
          userId: userId, 
          questionId: question.id,
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Nouveaux ELO:", responseData);
        setElo(responseData.newElo1); 
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
    updateElo(isCorrect);

    // Attendre 1 seconde avant de charger la prochaine question
    setTimeout(() => {
      fetchRandomQuestion();
    }, 1000);
  }

  return (
    <>
      <Navbar />

      <div className="elo-container">
        <p>
          <strong>Votre ELO :</strong> {elo !== null ? elo : "Chargement..."}
        </p>
        {newElo !== null && (
          <p>
            <strong>Nouvel ELO :</strong> {newElo}
          </p>
        )}
      </div>

      <div className="question-container">
        {question ? (
          <div>
            <p>
              <strong className="question">{question.question_text}</strong>
            </p>
            <div className="answers">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-button 
                    ${
                      selectedAnswer !== null &&
                      index === correctAnswerIndex &&
                      "correct"
                    }
                    ${
                      selectedAnswer === index &&
                      index !== correctAnswerIndex &&
                      "incorrect"
                    }`}
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
