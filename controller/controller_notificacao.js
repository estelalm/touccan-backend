const admin = require("firebase-admin")
const path = require('path');  // Para ajudar a construir o caminho para o arquivo de credenciais

async function initializeFirebase() {
  if (!admin.apps.length) {
    try {
      console.log("Inicializando Firebase...")

      // Caminho do arquivo de credenciais local
      const serviceAccountPath = path.join(__dirname, '..', 'config', 'touccan-firebase-firebase-adminsdk-8nuq5-acd9746fd3.json');

      // Inicializando o Firebase com o arquivo de credenciais
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath), // Usando o caminho do arquivo JSON
      });

      console.log("Firebase inicializado com sucesso!")
    } catch (error) {
      console.error("Erro ao inicializar o Firebase:", error)
    }
  }
}

function sendNotificationToUser(fcmToken, title, body) {
  const message = {
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log("Notificação enviada com sucesso:", response)
    })
    .catch((error) => {
      console.error("Erro ao enviar notificação:", error)
    })
}

module.exports = {
  sendNotificationToUser,
  initializeFirebase,
};
