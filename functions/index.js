const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const express = require('express');

// We have to import the built version of the server middleware.
const { app } = require('./__sapper__/build/server/server');

// exports.ssr = functions.https.onRequest(app);
exports.ssr = functions.https.onRequest(app);