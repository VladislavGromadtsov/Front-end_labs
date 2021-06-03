// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyASN7lgb9fmX12dB5f2p2THO_STDjk4Xx0",
    authDomain: "anki-app-49526.firebaseapp.com",
    databaseURL: "https://anki-app-49526-default-rtdb.firebaseio.com",
    projectId: "anki-app-49526",
    storageBucket: "anki-app-49526.appspot.com",
    messagingSenderId: "754126959880",
    appId: "1:754126959880:web:77a5251e9001e3acc928bd",
    measurementId: "G-18SS2RDLJ0"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        localStorage.setItem('uid', user.uid);
    } else {
        localStorage.removeItem('uid');
        window.location.replace('#/');
    }
});
