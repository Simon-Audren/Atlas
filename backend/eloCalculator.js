export function calculateElo(elo1, elo2, winner) {
    const K = 20; // Facteur d'ajustement (sensibilité)
    
    // Limitation de la différence à 400 points
    let difference = Math.max(-400, Math.min(elo1 - elo2, 400));

    // Calcul de la probabilité de victoire
    let expected1 = 1 / (1 + Math.pow(10, -difference / 400));
    let expected2 = 1 - expected1;

    // Attribution des scores
    const score1 = winner === "first" ? 1 : 0;
    const score2 = 1 - score1;

    // Nouveau calcul d'ELO
    const newElo1 = Math.round(elo1 + K * (score1 - expected1));
    const newElo2 = Math.round(elo2 + K * (score2 - expected2));

    return { newElo1, newElo2 };
}
