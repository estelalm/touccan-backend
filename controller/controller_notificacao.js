const admin = require("firebase-admin");

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function initializeFirebase() {
  if (!admin.apps.length) {
    // const client = new SecretManagerServiceClient();

    // const firebaseSecret = 'projects/163685389659/secrets/firebase-service-account/versions/latest';

    // const [version] = await client.accessSecretVersion({ name: firebaseSecret });
    // const serviceAccountKey = JSON.parse(version.payload.data.toString('utf8'));

    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccountKey),
    // });

    
    const path = require('path');
    admin.initializeApp({
      credential: admin.credential.cert(path.resolve(__dirname, "../config/touccan-firebase-firebase-adminsdk-8nuq5-acd9746fd3.json")),
    });

    console.log("Firebase inicializado com sucesso!");
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
      console.log("Notificação enviada com sucesso:", response);
    })
    .catch((error) => {
      console.error("Erro ao enviar notificação:", error);
    });
}



module.exports={
    sendNotificationToUser,
    initializeFirebase
}