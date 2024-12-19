const fetch = require("node-fetch");

exports.handler = async function () {
    try {
        // URL de l'API que vous souhaitez interroger
        const apiUrl = "https://app.currencyxchanger.ca/api/GetRates/json?ownerCode=AZU&branchCode=SOF"; // Remplacez par l'URL de votre API

        // Effectuer la requête à l'API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText} (${response.status})`);
        }

        // Extraire les données JSON de la réponse
        const jsonData = await response.json();

        // Retourner les données JSON sous forme de réponse
        return {
            statusCode: 200,
            body: JSON.stringify(jsonData),
        };
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);

        // Gestion des erreurs
        return {
            statusCode: 500,
            body: `Erreur serveur : ${error.message}`,
        };
    }
};
