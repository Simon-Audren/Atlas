import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aacunbvqmdakdllmzman.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3VuYnZxbWRha2RsbG16bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjMzOTUsImV4cCI6MjA1MTgzOTM5NX0.KH7rWXtBSYkmbYAYdWcsMy9cq1-aoPmq-MIIkLaOAWI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction de connexion via OAuth 
export const signInWithOAuth = async (provider = 'google') => {
  try {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider, 
    });

    if (error) {
      throw error;
    }
    console.log('Utilisateur connecté via OAuth : ', user);
    return { user, session };
  } catch (error) {
    console.error('Erreur lors de la connexion via OAuth : ', error.message);
    return { error: error.message };
  }
};

// Fonction pour récupérer l'utilisateur actuel
export const getCurrentUser = () => {
  const user = supabase.auth.user();
  console.log('Utilisateur actuel : ', user);
  return user;
};

// Fonction pour se déconnecter
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    console.log('Utilisateur déconnecté');
  } catch (error) {
    console.error('Erreur lors de la déconnexion : ', error.message);
  }
};

// Fonction pour gérer les changements de session (connecté/déconnecté)
export const listenToAuthChanges = (setUser) => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Événement d\'authentification :', event);
      console.log('Session :', session);
  
      if (session?.user) {
        setUser(session.user); 
      } else {
        setUser(null);é
      }
    });
  };

// Fonction pour rediriger vers la page de connexion si l'utilisateur n'est pas connecté
export const requireAuth = () => {
  const user = supabase.auth.user();
  if (!user) {
    window.location.href = '/login'; 
  }
};
