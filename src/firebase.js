import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAkefqr7mJgn6IQ9D508uTsfXZu4u0AwWk",
    authDomain: "to-do-vuejs.firebaseapp.com",
    projectId: "to-do-vuejs",
    storageBucket: "to-do-vuejs.appspot.com",
    messagingSenderId: "762381282992",
    appId: "1:762381282992:web:6a9c4d3f07cf96baea1575",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const userCollection = db.collection("users");
const taskCollection = db.collection("tasks");
const teamCollection = db.collection("teams");

export { firebase, auth, userCollection, taskCollection, teamCollection };
