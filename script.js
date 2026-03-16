import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const sideMenu = document.getElementById("sideMenu");
const menuBtn = document.getElementById("menuBtn");

const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");

const openSignup = document.getElementById("openSignup");
const openLogin = document.getElementById("openLogin");
const heroSignup = document.getElementById("heroSignup");
const heroBonus = document.getElementById("heroBonus");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const statusText = document.getElementById("statusText");

menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("show");
});

openSignup.addEventListener("click", () => signupModal.classList.remove("hidden"));
heroSignup.addEventListener("click", () => signupModal.classList.remove("hidden"));
openLogin.addEventListener("click", () => loginModal.classList.remove("hidden"));

heroBonus.addEventListener("click", () => {
  document.getElementById("bonuses").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-close");
    document.getElementById(modalId).classList.add("hidden");
  });
});
signupBtn.addEventListener("click", async () => {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!name  !email  !password) {
    alert("Please fill all signup fields.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      bonus: "100% Sign Up Bonus",
      balance: 0,
      createdAt: serverTimestamp()
    });

    alert("Account created successfully!");
    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupModal.classList.add("hidden");
  } catch (error) {
    alert(error.message);
  }
});

loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    alert("Please enter login details.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    loginEmail.value = "";
    loginPassword.value = "";
    loginModal.classList.add("hidden");
  } catch (error) {
    alert(error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
  } catch (error) {
    alert(error.message);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        statusText.innerHTML = 
          Logged in as: <strong>${data.name || "User"}</strong><br>
          Email: <strong>${data.email}</strong><br>
          Welcome Bonus: <strong>${data.bonus || "None"}</strong><br>
          Balance: <strong>$${data.balance ?? 0}</strong>
        ;
      } else {
        statusText.textContent = Logged in as ${user.email};
      }
    } catch (error) {
      statusText.textContent = Logged in as ${user.email};
    }
  } else {
    statusText.textContent = "No user logged in.";
  }
})
