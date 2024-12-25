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

    // Parcourir chaque objet et ajouter ses valeurs
    dataArray.forEach(obj => {
        try{
            const values = headers.map(header => {
                let value = obj[header] || ""; // Si la valeur est undefined ou null, la remplacer par une chaîne vide

                // Si la valeur est une chaîne qui contient des caractères spéciaux, l'échapper
                if (typeof value === "string" && (value.includes(";") || value.includes('"') || value.includes("\n"))) {
                    value = `"${value.replace(/"/g, '""')}"`; // Remplacer les guillemets par des guillemets échappés
                }
                return value;
            });

            csvRows.push(values.join(";")); // Ajouter la ligne au CSV
        }catch(error){
            if(obj == "Flag"){
                csvRows.push("");
            }
        }
    });

    // Devise à exclure
    const excludedCurrencies = ["EUR", "XAU"];

    // Appelle la fonction pour filtrer et trier
    const result = filterAndSortCurrencies(csvRows, excludedCurrencies);


    // Retourner les lignes CSV sous forme de chaîne
    return csvRows.join("\n");
}

function filterAndSortCurrencies(csvRows, excludedCurrencies) {
    if (!csvRows || !Array.isArray(csvRows)) {
        throw new Error("Les données fournies sont invalides ou ne sont pas un tableau.");
    }

    // Filtrer les devises en excluant celles spécifiées
    const filteredData = csvRows.filter(item => 
        !excludedCurrencies.includes(item.CurrencyAlias)
    );

    // Trier par ordre alphabétique (par 'FromCurrency' dans cet exemple)
    filteredData.sort((a, b) => a.FromCurrency.localeCompare(b.FromCurrency));

    // Retourner les données filtrées et triées
    return filteredData;
}
;
