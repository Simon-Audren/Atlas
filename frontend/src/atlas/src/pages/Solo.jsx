import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import { createClient } from '@supabase/supabase-js';
import "./Solo.css"; // Import du CSS

function Home() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false); // Évite les doubles clics rapides

  // Instance Supabase
  const supabase = createClient(
    'https://aacunbvqmdakdllmzman.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3VuYnZxbWRha2RsbG16bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjMzOTUsImV4cCI6MjA1MTgzOTM5NX0.KH7rWXtBSYkmbYAYdWcsMy9cq1-aoPmq-MIIkLaOAWI'
  );
  console.log("ENvironnement")
  console.log(process.env.SUPABASE_URL)

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  async function fetchRandomQuestion() {
    setLoading(true);
    
    // Récupère toutes les questions
    const { data, error } = await supabase
      .from("questions")
      .select("*");

    if (error) {
      console.error("Erreur:", error);
    } else {
      // Choisit une question aléatoire
      const randomQuestion = data[Math.floor(Math.random() * data.length)];
      setQuestion(randomQuestion);

      // Récupération et mélange des réponses
      const allAnswers = [
        randomQuestion.correct_answer,
        randomQuestion.wrong_answer_1,
        randomQuestion.wrong_answer_2,
        randomQuestion.wrong_answer_3,
        randomQuestion.wrong_answer_4,
        randomQuestion.wrong_answer_5
      ];
      setAnswers(allAnswers.sort(() => Math.random() - 0.5));
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <a href="/solo" className="box">Solo</a>
        <a href="/multijoueur" className="box">Multijoueur</a>
      </div>

      <div className="question-container">
        {question ? (
          <div>
            <p><strong>Question :</strong> {question.question_text}</p>
            <div className="answers">
              {answers.map((answer, index) => (
                <button 
                  key={index} 
                  className="answer-button" 
                  onClick={fetchRandomQuestion} 
                  disabled={loading} // Désactive les boutons pendant le chargement
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
