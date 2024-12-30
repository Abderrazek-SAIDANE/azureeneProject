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
    //const headers = Object.keys(dataArray[0]).filter(header => 
    //    header !== "FromCurrencyFlag" && header !== "ToCurrencyFlag" && header != "InverseRound" && header != "DirectRound" && header != "SequenceOrder" && header != "FromCurrency" && header != "ToCurrency"
    //);

    const headers = [
        "Flag", 
        "Country", 
        "CurrencyAlias", 
        "BuyRate", 
        "SellRate"
    ];


    // Tableau pour stocker les lignes CSV
    const csvRows = [];

    // Ajouter les en-têtes au CSV
    csvRows.push(headers.join(";"));

    // Liste des devises à exclure
    const excludedCurrencies = ["EUR", "XAU", "DZD"];

    // Filtrer les données pour exclure les devises non souhaitées
    const filteredData = dataArray.filter(obj => 
        !excludedCurrencies.includes(obj.CurrencyAlias)
    );

    // Vérification si les données filtrées sont vides
    if (filteredData.length === 0) {
        throw new Error("Aucune devise restante après filtrage !");
    }

    const prioritizedCurrencies = ["USD", "GBP", "CHF", "CAD", "JPY", "AUD",
                                   "SEK", "NOK", "DKK", "MAD"];

    // Trier les données :
    // 1. Les devises prioritaires en premier, dans l'ordre spécifié.
    // 2. Les autres devises en ordre alphabétique.
    const sortedData = filteredData.sort((a, b) => {
        const aPriority = prioritizedCurrencies.indexOf(a.CurrencyAlias);
        const bPriority = prioritizedCurrencies.indexOf(b.CurrencyAlias);

        if (aPriority !== -1 && bPriority !== -1) {
            // Si les deux devises sont prioritaires, garder leur ordre dans prioritizedCurrencies
            return aPriority - bPriority;
        } else if (aPriority !== -1) {
            // Si seule la devise 'a' est prioritaire, elle passe avant
            return -1;
        } else if (bPriority !== -1) {
            // Si seule la devise 'b' est prioritaire, elle passe avant
            return 1;
        } else {
            // Si aucune n'est prioritaire, trier par ordre alphabétique de leur alias
            return a.CurrencyAlias.localeCompare(b.CurrencyAlias);
        }
    });

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