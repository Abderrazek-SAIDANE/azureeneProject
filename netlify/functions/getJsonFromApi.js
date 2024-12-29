const fetch = require("node-fetch");
let previousData = null; // Cache pour stocker les données précédentes

exports.handler = async function () {
    try {
        const apiUrl = "https://app.currencyxchanger.ca/api/GetRates/json?ownerCode=AZU&branchCode=SOF";

        // Récupérer les données de l'API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText} (${response.status})`);
        }

        const currentData = await response.json();

        // Comparer avec les données précédentes
        const hasChanges = JSON.stringify(previousData) !== JSON.stringify(currentData);
        previousData = currentData; // Mettre à jour le cache

        // Retourner les données avec une indication des changements
        return {
            statusCode: 200,
            body: JSON.stringify({
                hasChanges,
                data: currentData,
            }),
        };
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);

        return {
            statusCode: 500,
            body: `Erreur serveur : ${error.message}`,
        };
    }
}

const fetchUpdatedRates = async () => {
    try {
        const response = await fetch('/.netlify/functions/getRates');
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des taux de change.");
        }

        const { hasChanges, data } = await response.json();

        if (hasChanges) {
            console.log("Les taux ont changé, mise à jour de l'affichage.");
            updateUI(data); // Fonction pour mettre à jour l'interface utilisateur
        } else {
            console.log("Aucun changement détecté.");
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des mises à jour :", error);
    }
};
