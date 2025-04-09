import React, { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import {
  signInWithOAuth,
  signOut,
  getCurrentUser,
  listenToAuthChanges,
} from "../SupabaseAuth.js";

function Account() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (user) {
      handleUserSync();
    }
  }, [user]);
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await handleUserSync(currentUser.id); // Synchronisation de l'ID
      }
    };

    fetchUser();
    listenToAuthChanges(setUser);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };
  const handleSignIn = async () => {
    await signInWithOAuth("google");
  };
  const handleUserSync = async () => {
    const userId = user.id;
    const elo = 1200; // Valeur d'ELO pour l'utilisateur test

    try {
      const response = await fetch("http://localhost:3001/auth-google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_id: userId, elo: elo }), // Envoi du google_id et de l'elo
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Nouvel utilisateur test ajouté :", data);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur test :", error);
    }
  };

  const handleAddTestUser = async () => {
    const userId = "f44d0894-787f-4b90-9d2a-f2244dafd4bf"; // ID utilisateur (google_id)
    const elo = 1200; // Valeur d'ELO pour l'utilisateur test

    try {
      const response = await fetch("http://localhost:3001/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_id: userId, elo: elo }), // Envoi du google_id et de l'elo
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Nouvel utilisateur test ajouté :", data);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur test :", error);
    }
  };

  const updateUserElo = async () => {
    const userId = user.id;
    const eloIncrement = 4; // L'incrément d'ELO à ajouter

    try {
      const response = await fetch("http://localhost:3001/update-elo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, eloIncrement: eloIncrement }), // Envoi du google_id
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("ELO mis à jour :", data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'ELO :", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="account-container">
        {user ? (
          <div>
            <p>
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Photo de profil"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <br />
              Bienvenue,{" "}
              {user.user_metadata ? user.user_metadata.full_name : user.email}
            </p>
            <br />
            <a className="box" onClick={handleSignOut}>
              Se déconnecter
            </a>
          </div>
        ) : (
          <div>
            <h2>Connexion</h2>
            <a className="box" onClick={handleSignIn}>
              Se connecter avec Google
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
