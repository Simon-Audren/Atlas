import { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import "./Home.css";
import AccordionItem from "../AccordionItem"; 

function Home() {
  return (
    <>
      <Navbar />

      <div className="container">
        <div className="left-content">
          <div className="textContainer">
            <p className="text">
              <span className="highlight">Atlas</span>, le jeu qui teste tes
              connaissances d'
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
            title="Qu'est ce que l'Elo ?"
            content={
              <div className="accordion-content">
                L’ELO est un système de notation qui cherche à évaluer le niveau
                de deux éléments afin de les comparer. Il est très connu pour
                son utilisation aux échecs.
                <br />
                l’ELO essaie d'estimer le pourcentage de chance que chaque
                joueur à de gagner. Pour Atlas, l'objectif est de comparer l’ELO
                d’un joueur par rapport à l’ELO d’une question.
                <br />
                <a
                  className="link"
                  href="https://fr.wikipedia.org/wiki/Classement_Elo"
                >
                  Lien Wikipédia
                </a>
              </div>
            }
          />
          <AccordionItem
            title="Comment l'Elo est calculé ?"
            content={
              <div className="accordion-content">
                L'Elo est un système de notation qui dépend de plusieurs
                variables.
                <br />
                Nouvel ELO = ELO + Sensibilité*(Victoire-Réciproque)
                <br />
                - Victoire vaut 0 ou 1 en fonction de si la personne a bien
                répondu à la question.
                <br />
                - La réciproque est une probabilité qui dépend de l'écart de
                niveau entre deux Elo. Une différence de zéro Elo renvoie une
                probabilité de 0,5 car il y a autant de chances que la personne
                se trompe ou qu'elle ait raison.
                <br />
                - La fonction de sensibilité détermine à quel point un joueur
                gagne ou perd rapidement de l'Elo. On souhaite que les joueurs
                aient une forte sensibilité au début du jeu pour trouver
                rapidement leur Elo réél. Cependant on souhaite également que
                cette fonction devienne de moins en moins forte au fur et à
                mesure du temps afin de se stabiliser autour de l'Elo réel du
                joueur et donc de ne pas être chaotique.
                <img
                  src="./Fonction réciproque.png"
                  alt="Fonction réciproque"
                  width="100%"
                />
                <p className="description">Fonction réciproque</p>
                <img
                  src="./Fonction de sensibilité.png"
                  alt="Fonction de sensibilité"
                  width="100%"
                />
                <p className="description">
                  Plusieurs propositions de fonction de sensibilité
                </p>
              </div>
            }
          />
          <AccordionItem
            title="Comment les questions sont choisies ?"
            content={
              <div className="accordion-content">
                L'objectif de la fonction d'attribution des questions est de
                donner une grande majorité de questions qui sont au niveau du
                joueur pour qu'elles soient adaptés à sa courbe de progression.
                <br />
                Afin de s'assurer que le calcul de l'Elo ne se trompe pas par
                rapport au niveau réel du joueur, la fonction d'attribution
                donne rarement également des questions très faciles et des
                questions très dures. En s'assurant que le joueur réussit les
                questions faciles et tend à échouer sur les questions dures, on
                s'assure de bien représenter son Elo.
                <img
                  src="./Fonction d'attribution.png"
                  alt="Fonction d'attribution"
                  width="100%"
                />
                <p className="description">Fonction géométrique</p>
                Ci-dessus la fonction géométrique qui détermine les questions
                qui seront affichés au joueur. On rentre dans la fonction un
                nombre aléatoire compris entre 0 et 1 et la fonction nous
                renvoie un nombre compris entre -200 et 200. Ce nombre est
                proche de l'Elo du joueur quand l'entrée vaut entre 0,3 et 0,7
                et part dans les extrêmes quand on se rapproche de 0 ou de 1.
                <br/>
                Une fois que la fonction a renvoyé son attribution, on regarde
                dans la base de données s'il existe une question proche de l'Elo
                du joueur + l'attribution et on l'affiche à l'écran. Si aucune
                question n'est suffisamment proche, on choisi aléatoirement
                parmi toutes les questions pour éviter la redondance.
              </div>
            }
          />
          <AccordionItem
            title="Puis-je avoir un Elo négatif ?"
            content={
              <div className="accordion-content">
                Il n'est pas possible d'avoir un Elo négatif sur Atlas.
                <br />
                Cependant il existe une particularité : l'Elo affiché sur le
                site peut ne pas correspondre à l'Elo stocké dans la base de
                données. En effet, le système de notation d'Elo fonctionne
                parfaitement, même avec des Elos négatifs. La différence entre
                -100 et 0 est la même qu'entre 1000 et 1100.
                <br />
                Cependant, afin de préserver l'égo des joueurs d'Atlas et pour
                la beauté de la chose, le site affiche un chiffre qui ne peut
                pas être négatif. Pour ce faire à partir d'un certain seuil,
                l'Elo subit une transformation géométrique comme suit :
                <br />
                100 Elo affiche 100 Elo
                <br />
                0 Elo affiche 50 Elo
                <br />
                -100 Elo affiche 25 Elo
                <br />
                -200 Elo affiche 12 Elo etc...
                <br />
                <img
                  src="./Fonction géométrique.png"
                  alt="Fonction géométrique"
                  width="100%"
                />
                <p className="description">Fonction géométrique</p>
                Dans ce cas précis, il existe donc une différence entre l'Elo
                affiché et celui qui existe dans la base de données.
              </div>
            }
          />
        </div>
      </div>

      <p>Un site réalisé par Simon Audren</p>
    </>
  );
}

export default Home;
