import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtnjE3f-dwzU-w-pnk3HW2BuaZsuzz3ow",
  authDomain: "rivers-slots.firebaseapp.com",
  projectId: "rivers-slots",
  storageBucket: "rivers-slots.firebasestorage.app",
  messagingSenderId: "438824341015",
  appId: "1:438824341015:web:7c8fd74b47ad189ec1d652"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const user = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", user.user.uid), {
    email: email,
    balance: 0
  });

  alert("Account Created!");
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  await signInWithEmailAndPassword(auth, email, password);

  alert("Logged In!");
});
