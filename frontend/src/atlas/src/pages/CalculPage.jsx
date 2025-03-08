import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import Calculator from "../Calcul.jsx";
import { createClient } from '@supabase/supabase-js';

function CalculPage() {

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
      </div>
    </>
  );
}

export default CalculPage;
