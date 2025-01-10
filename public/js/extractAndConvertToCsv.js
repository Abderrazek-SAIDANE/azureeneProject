function extractAndConvertToCsv(jsonData) {
    // Vérification si les données contiennent la clé 'Data'
    if (!jsonData || !jsonData.Data || !Array.isArray(jsonData.Data)) {
        throw new Error("Les données de l'API ne sont pas dans le format attendu !");
    }

    const dataArray = jsonData.Data;

    // Vérification si le tableau 'Data' est vide
    if (dataArray.length === 0) {
        throw new Error("Le tableau 'Data' est vide !");
    }

    // Définir les devises à afficher dans un ordre précis
    const displayCurrencies = ["USD", "GBP", "JPY"];

    // Extraire les en-têtes du CSV
    const headers = ["Flag", "Country", "CurrencyAlias", "BuyRate", "SellRate"];

    // Tableau pour stocker les lignes CSV
    const csvRows = [];

    // Ajouter les en-têtes au CSV
    csvRows.push(headers.join(";"));

    // Filtrer les données pour ne garder que les devises à afficher
    const filteredData = dataArray.filter(obj => 
        displayCurrencies.includes(obj.CurrencyAlias)
    );

    // Trier les devises selon leur ordre dans la liste 'displayCurrencies'
    const sortedData = filteredData.sort((a, b) => {
        const aIndex = displayCurrencies.indexOf(a.CurrencyAlias);
        const bIndex = displayCurrencies.indexOf(b.CurrencyAlias);
        return aIndex - bIndex; // Respecter l'ordre défini dans 'displayCurrencies'
    });

    // Vérification si les données filtrées sont vides
    if (sortedData.length === 0) {
        throw new Error("Aucune devise à afficher selon la liste définie !");
    }

    // Parcourir chaque objet filtré et ajouter ses valeurs avec les taux inversés
    sortedData.forEach(obj => {
        const buyRate = parseFloat(obj.BuyRate);
        const sellRate = parseFloat(obj.SellRate);
        const inverseBuyRate = parseFloat(obj.InverseBuyRate);
        const inverseSellRate = parseFloat(obj.InverseSellRate);

        // Ligne avec les taux inversés
        csvRows.push([
            obj.Flag,
            obj.Country,
            obj.CurrencyAlias,
            obj.BuyRate, // Utilisation de \r\n pour un retour à la ligne
            obj.SellRate// Utilisation de \r\n pour un retour à la ligne
        ].join(";"));
    });

    // Retourner les lignes CSV sous forme de chaîne
    
    return csvRows.join("\n");
};
