import * as admin from "firebase-admin";

export const init = function() {
    const serviceAccount = require('../../FirebaseServiceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log("Successfully Firebase Initialized")
};

export interface Notification {
    title: string,
    body: string
}

export const send = async function(token: string, data: any, noti: Notification) {
    const message = {
        token: token
    };

    if(data != null) {
        message['data'] = data;
    }

    if(noti != null) {
        message['notification'] = noti;
    }

    return await admin.messaging().send(message);
};