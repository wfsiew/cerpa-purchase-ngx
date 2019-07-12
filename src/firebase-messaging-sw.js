importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-messaging.js');
firebase.initializeApp({
  'messagingSenderId': '888766688902'
});

const messaging = firebase.messaging(); 