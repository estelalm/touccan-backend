const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./path/to/your-service-account.json")),
});

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
    sendNotificationToUser
}