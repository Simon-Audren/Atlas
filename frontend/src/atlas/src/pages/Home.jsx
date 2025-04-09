import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import Calculator from "../Calcul.jsx";
import { createClient } from "@supabase/supabase-js";
import "./Home.css";
import AccordionItem from '../AccordionItem'; // Import du composant AccordionItem

function Home() {
  return (
    <>
  <Navbar />

  <div className="container">
    <div className="left-content">
      <div className="textContainer">
        <p className="text">
          <span className="highlight">Atlas</span>, le jeu qui teste tes connaissances d'
          <span className="highlight">histoire</span>, de
          <span className="highlight"> géographie</span> et de
          <span className="highlight"> culture générale</span>
        </p>
      </div>

      <a href="/Solo" className="box">
        Jouer
      </a>
    </div>

    <div className="right-content">
      <img
        className="illustration"
        src="/illustration.jpg"
        alt="Illustration d'un vitrail"
      />
    </div>
  </div>

  <div className="accordion-container">
  <div>
      <AccordionItem 
        title="Comment l'Elo est calculé ?" 
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
      />
      <AccordionItem 
        title="Comment les questions sont choisies ?" 
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
      />
      <AccordionItem 
        title="Puis-je avoir un elo négatif ?" 
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
      />
      <AccordionItem 
        title="Accordion 4" 
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
      />
    </div>

  </div>

  <p>agdyagdadayviayv</p>
</>

  );
}

export default Home;
