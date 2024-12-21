function refreshAt10AM() {
    // Obtenir la date actuelle
    const now = new Date();
    const targetTime = new Date();

    // Définir l'heure cible à 10h00 du matin aujourd'hui
    targetTime.setHours(20, 12, 0, 0);

    // Si l'heure actuelle est déjà après 10h00, définir la cible pour demain à 10h00
    if (now.getTime() > targetTime.getTime()) {
        targetTime.setDate(now.getDate() + 1);
    }

    // Calculer le délai jusqu'à 10h00 du matin
    const timeToWait = targetTime.getTime() - now.getTime();

    // Attendre jusqu'à 10h00 et recharger la page
    setTimeout(function() {
        location.reload(); // Recharge la page
        refreshAt10AM();   // Appelle à nouveau la fonction pour qu'elle s'exécute chaque jour
    }, timeToWait);
}