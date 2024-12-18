document.addEventListener("DOMContentLoaded", async () => {
    const ratesContainer = document.getElementById("rates-container");
  
    try {
      // Appel à la fonction serverless pour récupérer le fichier
      const response = await fetch("/.netlify/functions/getCsvFromFtp");
      if (!response.ok) throw new Error("Erreur lors du chargement des données");
  
      const data = await response.text();
  
      // Affichage des données dans la page (XML ou texte brut)
      // ratesContainer.innerHTML = `<pre>${data}</pre>`;
    } catch (error) {
      console.error("Erreur :", error);
      ratesContainer.textContent = "Impossible de charger les taux.";
    }
    return data;
  });
  