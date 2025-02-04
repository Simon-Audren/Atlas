console.log("Serveur démarré...");

import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Nouvelle route pour ajouter une question et ses réponses
app.post('/add-question', async (req, res) => {
    const { question_text, category, correct_answer, answers } = req.body;
    
    const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert([{ question_text, category, correct_answer }])
        .single();

    if (questionError) {
        console.error('Error adding question:', questionError);
        return res.status(500).send('Error adding question');
    }

    const answerData = answers.map(answer => ({
        question_id: question.id,  // Associer la question à ses réponses
        answer_text: answer
    }));

    const { error: answerError } = await supabase
        .from('answers')
        .insert(answerData);

    if (answerError) {
        console.error('Error adding answers:', answerError);
        return res.status(500).send('Error adding answers');
    }

    res.status(200).send('Question added successfully');
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
