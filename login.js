import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUwKZzUpAjz13GqPqI26xbtavX3MHxKcE",
  authDomain: "aye48-1cb5e.firebaseapp.com",
  projectId: "aye48-1cb5e",
  storageBucket: "aye48-1cb5e.firebasestorage.app",
  messagingSenderId: "103001979724",
  appId: "1:103001979724:web:8b17edebddeaf26c15ede9",
  measurementId: "G-MSNML958S4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Store user in localStorage to know who is posting updates
    localStorage.setItem("userEmail", email);

    window.location.href = "updates.html";
  } catch (err) {
    error.textContent = "Login failed. Check email or password.";
  }
});
