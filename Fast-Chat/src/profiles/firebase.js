const admin = require('firebase-admin');
const config = require('../config');

let initialized = false;

function initFirebase() {
  if (initialized) return;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
    databaseURL: config.firebase.databaseURL,
  });

  initialized = true;
}

function getDatabase() {
  initFirebase();
  return admin.database();
}

module.exports = { getDatabase, initFirebase };
