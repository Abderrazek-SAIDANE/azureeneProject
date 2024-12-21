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

    // Extraire les en-têtes du CSV (les clés du premier objet), en excluant 'FromCurrencyFlag' et 'ToCurrencyFlag'
    const headers = Object.keys(dataArray[0]).filter(header => 
        header !== "FromCurrencyFlag" && header !== "ToCurrencyFlag" && header != "InverseRound" && header != "DirectRound" && header != "SequenceOrder" && header != "FromCurrency" && header != "ToCurrency"
    );

    // Tableau pour stocker les lignes CSV
    const csvRows = [];

    // Ajouter les en-têtes au CSV
    csvRows.push(headers.join(";"));

    // Parcourir chaque objet et ajouter ses valeurs
    dataArray.forEach(obj => {
        const values = headers.map(header => {
            let value = obj[header] || ""; // Si la valeur est undefined ou null, la remplacer par une chaîne vide

            // Si la valeur est une chaîne qui contient des caractères spéciaux, l'échapper
            if (typeof value === "string" && (value.includes(";") || value.includes('"') || value.includes("\n"))) {
                value = `"${value.replace(/"/g, '""')}"`; // Remplacer les guillemets par des guillemets échappés
            }
            return value;
        });

        csvRows.push(values.join(";")); // Ajouter la ligne au CSV
    });

    // Retourner les lignes CSV sous forme de chaîne
    return csvRows.join("\n");
}

// Exemple d'appel
const apiResponse = {
    "Message": null,
    "Success": true,
    "Data": [
        {
            "BuyRate": 0.23900,
            "InverseBuyRate": 4.1841,
            "InverseSellRate": 3.0331,
            "SellRate": 0.32970,
            "FromCurrency": "TND",
            "ToCurrency": "EUR",
            "FromCurrencyFlag": "https://app.currencyxchanger.ca/Content/CountryFlags/TND.png",
            "ToCurrencyFlag": "https://app.currencyxchanger.ca/Content/CountryFlags/EUR.png",
            "CurrencyAlias": "TND",
            "Country": "Tunisia",
            "SequenceOrder": null,
            "DirectRound": 5,
            "InverseRound": 4
        },
        {
            "BuyRate": 1.11000,
            "InverseBuyRate": 0.9009,
            "InverseSellRate": 0.7752,
            "SellRate": 1.29000,
            "FromCurrency": "GBP",
            "ToCurrency": "EUR",
            "FromCurrencyFlag": "https://app.currencyxchanger.ca/Content/CountryFlags/GBP.png",
            "ToCurrencyFlag": "https://app.currencyxchanger.ca/Content/CountryFlags/EUR.png",
            "CurrencyAlias": "GBP",
            "Country": "United Kingdom",
            "SequenceOrder": null,
            "DirectRound": 5,
            "InverseRound": 4
        },
        {
            "BuyRate": 0.00673,
            "InverseBuyRate": 148.5884,
            "InverseSellRate": 134.4086,
            "SellRate": 0.00744,
            "FromCurrency": "DZD",
            "ToCurrency": "EUR",
            "FromCurrencyFlag": "https://app.currencyxchanger.ca/Content/CountryFlags/DZD.png",
            "ToCurrencyFlag": "https://app.currencyxchanger.ca/Content/CountryFlags/EUR.png",
            "CurrencyAlias": "DZD",
            "Country": "Algeria",
            "SequenceOrder": null,
            "DirectRound": 5,
            "InverseRound": 4
        }
    ]
};

try {
    const csvData = extractAndConvertToCsv(apiResponse);
    console.log(csvData); // Afficher le CSV
} catch (error) {
    console.error("Erreur :", error.message); // Gérer l'erreur
}
