import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import Calculator from "../Calcul.jsx";
import { createClient } from '@supabase/supabase-js';

function Home() {
 

  return (
    <>
      <Navbar />
      <h1>Bienvenue sur Atlas !</h1>
      <div className="container">
        <a href="/Solo" className="box">
          Solo
        </a>
        <a href="/multijoueur" className="box">
          Multijoueur
        </a>
      </div>
      <div className="container">
      <a href="/CalculPage" className="box">
          Calcul de l'ELO
        </a>
        </div>
      
    </>
  );
}

export default Home;
