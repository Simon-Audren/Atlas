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
          Jouer
        </a>

      </div>
    </>
  );
}

export default Home;
