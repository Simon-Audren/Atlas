import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import Calculator from "../Calcul.jsx";
import { createClient } from '@supabase/supabase-js';

function Home() {
  const [question, setQuestion] = useState(null);  // State pour stocker la question

  // Crée une instance de Supabase
  const supabase = createClient('https://aacunbvqmdakdllmzman.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3VuYnZxbWRha2RsbG16bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjMzOTUsImV4cCI6MjA1MTgzOTM5NX0.KH7rWXtBSYkmbYAYdWcsMy9cq1-aoPmq-MIIkLaOAWI');

  useEffect(() => {
    // Fonction pour récupérer la question depuis Supabase
    async function getQuestion() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq("id", 3)
        .single();  // Récupère une seule ligne
      
      if (error) {
        console.error('Erreur:', error);
      } else {
        setQuestion(data);  // Sauvegarde la question dans le state
      }
    }

    getQuestion();  // Appelle la fonction au chargement du composant
  }, []);  // [] signifie que l'effet ne se déclenche qu'une seule fois, à l'initialisation

  return (
    <>
      <Navbar />
      <h1>Bienvenue sur Atlas !</h1>
      <div className="container">
        <a href="/solo" className="box">
          Solo
        </a>
        <a href="/multijoueur" className="box">
          Multijoueur
        </a>
      </div>

      <div className="question-container">
        {question ? (
          <div>
            <p><strong>Question :</strong> {question.question_text}</p>
            <p><strong>Réponse correcte :</strong> {question.correct_answer}</p>
          </div>
        ) : (
          <p>Chargement de la question...</p>
        )}
      </div>
    </>
  );
}

export default Home;
