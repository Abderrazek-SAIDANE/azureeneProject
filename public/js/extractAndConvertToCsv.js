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
    const displayCurrencies = ["USD", "GBP", "CAD", "CHF", "AUD", "DKK", "NOK", "SEK", "JPY", "CNY", "HKD", "AED", "SAR", "MXN", "EGP", "THB", "TND", "MAD"];

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

    // Parcourir chaque objet filtré et ajouter ses valeurs
    sortedData.forEach(obj => {
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
};
