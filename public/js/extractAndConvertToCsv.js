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

        // Parcourir chaque objet filtré et ajouter ses valeurs avec les taux inversés
        sortedData.forEach(obj => {

            if (obj.Country === "United Kingdom of Great Britain and Northern Ireland") {
                obj.Country = "United Kingdom";
            }

            const buyRate = parseFloat(obj.BuyRate);
            const sellRate = parseFloat(obj.SellRate);
            const inverseBuyRate = parseFloat(obj.InverseBuyRate);
            const inverseSellRate = parseFloat(obj.InverseSellRate);
    
            /*if (isNaN(buyRate) || isNaN(sellRate)) {
                throw new Error(`Les taux d'achat ou de vente sont invalides pour la devise ${obj.CurrencyAlias}`);
            }*/
    
            // Ligne avec les taux inversés
            csvRows.push([
                obj.Flag,
                obj.Country,
                obj.CurrencyAlias,
                `"1 EUR = ${inverseBuyRate} ${obj.CurrencyAlias}\r\n1 ${obj.CurrencyAlias} = ${buyRate} EUR"`, // Utilisation de \r\n pour un retour à la ligne
                `"1 EUR = ${inverseSellRate} ${obj.CurrencyAlias}\r\n1 ${obj.CurrencyAlias} = ${sellRate} EUR"` // Utilisation de \r\n pour un retour à la ligne
            ].join(";"));
        });
        
    // Retourner les lignes CSV sous forme de chaîne
    return csvRows.join("\n");
};