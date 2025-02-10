import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

console.log(process.env.SUPABASE_URL);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Route pour récupérer toutes les questions
app.get('/questions', async (req, res) => {
    const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, category, correct_answer'); // Sélectionner explicitement les colonnes

    if (error) {
        console.error('Error fetching questions:', error.message, error.details);
        return res.status(500).json({ error: 'Error fetching questions' });
    }

    res.status(200).json(data);
});

// Route pour ajouter une question et ses réponses
app.post('/add-question', async (req, res) => {
    const { question_text, category, correct_answer, answers } = req.body;

    const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert([{ question_text, category, correct_answer }])
        .single();

    if (questionError) {
        console.error('Error adding question:', questionError.message, questionError.details);
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
        console.error('Error adding answers:', answerError.message, answerError.details);
        return res.status(500).send('Error adding answers');
    }

    res.status(200).send('Question added successfully');
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
