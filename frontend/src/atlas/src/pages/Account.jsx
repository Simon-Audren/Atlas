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
