# Atlas
! Attention ! ce projet ne s'installe pas sur Mac.
Afin de cloner le repository, lancer Visual Studio Code
CTRL+MAJ+ù pour ouvrir une console ou "Terminal", "New Terminal" en haut
Cloner le repository git clone https://github.com/Simon-Audren/Atlas.git
Si la pop-up s'affiche, connectez-vous à votre github, sinon ignorez cette étape
Si n'est pas déjà le cas, activer Auto Save dans Visual Studio Code
"File" en haut à gauche
"Auto Save" dans le menu déroulant

1 - Vous pouvez copier coller :
cd Atlas
cd frontend
cd src
cd atlas

puis copier coller (durée estimée 30 à 60 secondes de téléchargement) :
npm install
npm install @supabase/supabase-js
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

Enfin:
npm run dev

2 - Ouvrez une deuxième terminal (CTRL+MAJ+ù ou "Terminal", "New Terminal" en haut)
puis :
cd Atlas
cd backend

et ensuite :
npm install express
npm install cors


créer un fichier qui s'appelle juste ".env" dans le dossier backend
Cliquez sur le dossier backend
Puis "File", "New File" en haut à gauche
nommez le ".env"
copiez ceci dans votre .env nouvellement créé:
SUPABASE_URL=https://aacunbvqmdakdllmzman.supabase.co,
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3VuYnZxbWRha2RsbG16bWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjMzOTUsImV4cCI6MjA1MTgzOTM5NX0.KH7rWXtBSYkmbYAYdWcsMy9cq1-aoPmq-MIIkLaOAWI

puis faites dans le terminal node server.js
Ignorez le localhost 3001
Allez sur le site à cette adresse (le read.me n'est pas fini !) : http://localhost:5173/
Allez dans l'onglet profil en haut à droite
Connectez-vous avec une adresse google quelconque (obligatoire !)
Retournez de nouveau dans l'onglet profil en haut à droite (obligatoire !)

A partir de là, vous pouvez profiter du jeu et des questions !

