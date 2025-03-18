import React, { useState, useEffect } from 'react';
import Navbar from "../navbar.jsx";
import { signInWithOAuth, signOut, getCurrentUser, listenToAuthChanges } from "../SupabaseAuth.js";

function Account() {
    const [user, setUser] = useState(null);

    // Effet pour récupérer l'utilisateur au chargement du composant et écouter les changements de session
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                await handleUserSync(currentUser.id); // Ajouter l'utilisateur si nécessaire
            }
        };

        fetchUser(); // Appel initial pour récupérer l'utilisateur
        listenToAuthChanges(setUser); // Écouter les changements de session (connexion/déconnexion)

    }, []); // Dépendances vides pour que ça s'exécute une seule fois au montage du composant

    // Fonction pour gérer la connexion
    const handleSignIn = async () => {
        await signInWithOAuth('google'); // Connexion via Google
    };

    // Fonction pour gérer la déconnexion
    const handleSignOut = async () => {
        await signOut();
        setUser(null);
    };

    // Fonction pour envoyer l'ID utilisateur au backend et vérifier s'il doit être ajouté
    const handleUserSync = async (userId) => {
        try {
            const response = await fetch("http://localhost:3001/auth-google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId, // Envoie l'ID utilisateur de Supabase
                }),
            });

            const data = await response.json();
            console.log(data); // Affiche la réponse du serveur
        } catch (error) {
            console.error("Erreur lors de la synchronisation de l'utilisateur :", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="account-container">
                {user ? (
                    <div>
                        <p>Bienvenue, {user.user_metadata ? user.user_metadata.full_name : user.email}</p>
                        <button onClick={handleSignOut}>Se déconnecter</button>
                    </div>
                ) : (
                    <div>
                        <h2>Connexion</h2>
                        <button onClick={handleSignIn}>Se connecter avec Google</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;
