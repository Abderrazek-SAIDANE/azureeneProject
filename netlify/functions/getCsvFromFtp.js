const ftp = require('basic-ftp');  // Import de la bibliothèque FTP

// Fonction pour récupérer le fichier CSV depuis le serveur FTP
async function getCsvFromFtp() {
    const client = new ftp.Client();   // Création d'un client FTP
    client.ftp.verbose = true;          // Active le mode verbose pour plus de logs

  try {
    // Accédez au serveur FTP
    await client.access({
      host: "ftpupload.net", // Remplacez par l'adresse de votre serveur FTP
      user: "if0_37930858",      // Nom d'utilisateur FTP
      password: "PsyUXjvKSbeEY",  // Mot de passe FTP
      secure: false               // Mettez à true si le serveur utilise FTPS
    });

    // Téléchargez le fichier
    const fileData = await client.downloadTo(Buffer.alloc(0), "./htdocs/test2.csv"); // Chemin du fichier FTP

    return fileData.toString("utf-8");  // Retourne le contenu du fichier CSV en tant que texte
  } catch (err) {
    console.error("Erreur FTP:", err);
        throw new Error("Impossible de récupérer le fichier depuis le serveur FTP.");
    } finally {
        client.close();  // Ferme la connexion FTP après l'opération
    }

}

// Fonction API pour exposer le contenu du fichier CSV
module.exports.handler = async (event) => {
    try {
        const csvData = await getCsvFromFtp();  // Appel de la fonction pour obtenir les données CSV
        return {
            statusCode: 200,
            body: csvData,  // Envoie le contenu CSV dans la réponse
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur serveur", error }),
        };
    }
};
