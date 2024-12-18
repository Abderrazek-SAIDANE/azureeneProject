const ftp = require("basic-ftp");

exports.handler = async function () {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Activez les logs si besoin

  try {
    // Accédez au serveur FTP
    await client.access({
      host: "ftpupload.net", // Remplacez par l'adresse de votre serveur FTP
      user: "if0_37930858",      // Nom d'utilisateur FTP
      password: "PsyUXjvKSbeEY",  // Mot de passe FTP
      secure: false               // Mettez à true si le serveur utilise FTPS
    });

    // Téléchargez le fichier
    const stream = await client.downloadToBuffer("./htdocs/test2.csv"); // Chemin du fichier FTP

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/xml" }, // Ou "application/csv" si c'est un CSV
      body: stream.toString() // Renvoie le contenu du fichier
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de l'accès au serveur FTP" })
    };
  } finally {
    client.close();
  }
};
