import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import Calculator from "../Calcul.jsx";
//import supabase from "../../../../../backend/index.js";
function Home(){
/*const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase;
      formControlClasses("questions").select();

      if (error) {
        setFetchError("Could not fetch question");
        setQuestions(null);
        console.log(error);
      }
      if (data) {
        setQuestions(data);
        setFetchError(null);
      }
    };
    fetchQuestions();
  }, []);*/
  return (
    <>
      <Navbar />
      <h1>Bienvenue sur Atlas !</h1>
      <Calculator />
      <div className="container">
        <a href="/solo" className="box">
          Solo
        </a>
        <a href="/multijoueur" className="box">
          Multijoueur
        </a>
        {/*<div>
          {fetchError && <p>{fetchError}</p>}
          {questions && <div className="questions">{questions.map(question => (<p>{question.question.text}</p>))}
            </div>}
        </div>*/}
      </div>
    </>
  );
};

export default Home;
