import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

dotenv.config();

globalThis.fetch = fetch;

const app = express();
const port = process.env.PORT || 3000;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// Fonction pour récupérer la question et la réponse
async function getQuestion() {
  const { data, error } = await supabase
    .from('questions')  // Assure-toi que la table s'appelle bien 'questions'
    .select('*')
    .single();  // Récupère une seule ligne
  
  if (error) {
    console.error('Erreur:', error);
  } else {
    console.log('Question:', data.question_text);
    console.log('Réponse:', data.correct_answer);
  }
}

getQuestion();



