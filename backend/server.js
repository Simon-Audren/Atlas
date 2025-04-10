import express from "express";
import cors from "cors"; // Ajout de l'importation de cors
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Utilisation de CORS (toutes les origines sont autorisées)
app.use(cors()); // Ajoute ce middleware pour activer CORS
app.use(express.json());

// Initialisation de Supabase avec les variables d'environnement
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Route pour récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
  console.log("Demande pour récupérer toutes les utilisateurs");

  try {
    // Récupérer toutes les questions dans la table "users"
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.log("Erreur lors de la récupération des utilisateurs : ", error);
      return res
        .status(500)
        .json({
          error: "Erreur lors de la récupération des utilisateurs",
          details: error.message,
        });
    }

    console.log("Utilisateurs récupérées avec succès : ", users);
    return res.status(200).json(users);
  } catch (error) {
    console.log("Erreur serveur : ", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
});

// Route POST pour l'ajout d'un nouvel utilisateur via Google
app.post("/auth-google", async (req, res) => {
  // Affichage du corps de la requête dans la console du serveur
  console.log("Requête reçue:", req.body);

  const { google_id } = req.body; // Récupération du google_id
  console.log("ID utilisateur reçu:", google_id);

  if (!google_id) {
    return res.status(400).json({ error: "ID utilisateur Google manquant" });
  }

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("google_id, elo")
      .eq("google_id", google_id) // Utilisation de google_id pour chercher l'utilisateur
      .single();

    if (existingUser) {
      console.log("Utilisateur existant trouvé avec google_id:", google_id);
      return res
        .status(200)
        .json({ message: "Utilisateur déjà existant", user: existingUser });
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ google_id: google_id, elo: 1200 }]) // Insertion du google_id et de l'elo
      .select("google_id, elo")
      .single();

    if (insertError) throw insertError;

    console.log("Utilisateur créé avec google_id:", google_id);
    return res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
});

// Route POST pour mettre à jour l'ELO
app.post("/update-elo", async (req, res) => {
  const { user_id, eloIncrement } = req.body; // On récupère l'ID utilisateur (google_id) et l'incrément d'ELO

  if (!user_id || eloIncrement === undefined) {
    return res
      .status(400)
      .json({ error: "ID utilisateur ou incrément d'ELO manquant" });
  }

  try {
    // Récupérer l'utilisateur existant en utilisant google_id
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("google_id, elo")
      .eq("google_id", user_id) // Recherche par google_id (UUID)
      .single();

    if (fetchError) {
      return res
        .status(500)
        .json({
          error: "Erreur lors de la récupération de l'utilisateur",
          details: fetchError.message,
        });
    }

    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Calculer le nouvel ELO
    const newElo = existingUser.elo + eloIncrement;

    // Mettre à jour l'ELO dans la base de données
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ elo: newElo })
      .eq("google_id", user_id) // Mise à jour par google_id (UUID)
      .select("google_id, elo")
      .single();

    if (updateError) {
      return res
        .status(500)
        .json({
          error: "Erreur lors de la mise à jour de l'ELO",
          details: updateError.message,
        });
    }

    return res
      .status(200)
      .json({ message: "ELO mis à jour", user: updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
});

// Route POST pour ajouter un utilisateur test
app.post("/test", async (req, res) => {
  console.log("Requête reçue pour ajouter un utilisateur test");

  try {
    const { google_id, elo } = req.body; // Récupération du google_id et elo depuis le corps de la requête

    if (!google_id || elo === undefined) {
      return res.status(400).json({ error: "google_id ou elo manquant" });
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ google_id: google_id, elo: elo }]) // Utilisation de google_id et elo
      .select("google_id, elo")
      .single();

    if (insertError) throw insertError;

    return res.status(201).json({ message: "Utilisateur créé", user: newUser });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
});

// Route principale
app.get("/", (req, res) => {
  res.send("Serveur démarré, bienvenue sur l'API de l'ELO !");
});

const calculateElo = (elo1, elo2, winner, nbQuestions) => {
    const K = 20; // Facteur d'ajustement
    
    // Calculer la différence d'ELO
    let difference = Math.max(-400, Math.min(elo1 - elo2, 400));
    
    // Calcul de la valeur réciproque
    let expected1 = 1 / (1 + Math.pow(10, -difference / 400));
    let expected2 = 1 - expected1;
  
    // Calcul du score du gagnant
    const score1 = winner === "first" ? 1 : 0;
    const score2 = 1 - score1;
  
    // Calcul de la sensibilité en fonction du nombre de questions
    const sensibilite = -60 / (1 + Math.exp(-0.055 * nbQuestions)) + 70;
  
    // Calcul des nouveaux ELO en appliquant la sensibilité
    const newElo1 = Math.round(elo1 + sensibilite * (score1 - expected1));
    const newElo2 = Math.round(elo2 + sensibilite * (score2 - expected2));
  
    return { newElo1, newElo2, sensibilite };
  };
  
  // Endpoint pour calculer et mettre à jour l'ELO
  app.post("/calculate-elo", async (req, res) => {
    const { player1_elo, player2_elo, winner, userId, questionId } = req.body;
  
    if (player1_elo === undefined || player2_elo === undefined || !winner || !userId) {
      return res.status(400).json({ error: "Données incomplètes" });
    }
  
    try {
      // Récupérer le nombre de questions répondues par l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("nb_questions")
        .eq("google_id", userId)
        .single();
  
      if (userError || !userData) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      const nbQuestions = userData.nb_questions || 0;
  
      // Calcul des nouveaux ELO et de la sensibilité
      const { newElo1, newElo2, sensibilite } = calculateElo(player1_elo, player2_elo, winner, nbQuestions);
  
      // Mise à jour des ELO et du nombre de questions dans la base de données
      await supabase
        .from("users")
        .update({ elo: newElo1, nb_questions: nbQuestions + 1 })
        .eq("google_id", userId);
  
      // Mise à jour de l'ELO de la question
      await supabase
        .from("questions")
        .update({ elo: newElo2 })
        .eq("id", questionId);
  
      res.json({ newElo1, newElo2, sensibilite });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  });
  

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);
