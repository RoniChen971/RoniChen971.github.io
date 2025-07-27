import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUwKZzUpAjz13GqPqI26xbtavX3MHxKcE",
  authDomain: "aye48-1cb5e.firebaseapp.com",
  databaseURL: "https://aye48-1cb5e-default-rtdb.firebaseio.com",
  projectId: "aye48-1cb5e",
  storageBucket: "aye48-1cb5e.appspot.com",
  messagingSenderId: "103001979724",
  appId: "1:103001979724:web:8b17edebddeaf26c15ede9",
  measurementId: "G-MSNML958S4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("login-btn").addEventListener("click", () => {
  window.location.href = "login.html";
});

const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");
const closeButton = document.getElementById("closeButton");

chatWidget.style.display = "block";
closeButton.addEventListener("click", () => chatWidget.style.display = "none");
chatToggle.addEventListener("click", () => chatWidget.style.display = "block");

const chatMessages = document.getElementById("chatMessages");
const updatesRef = ref(db, "updates");




onValue(updatesRef, (snapshot) => {
  chatMessages.innerHTML = "";
  const data = snapshot.val();
  if (!data) return;

  Object.values(data).forEach(update => {
    const div = document.createElement("div");
    div.className = "message";

    div.innerHTML = `
      <div class="user-info">
        <img src="${update.photo || 'images/default.jpg'}" class="user-photo" alt="${update.user}">
        <span class="sender">${update.user}</span>
      </div>
      <div class="message-content">
        <p class="text">${update.text || ""}</p>
        <span class="timestamp">${new Date(update.time).toLocaleString()}</span>
      </div>
    `;
    chatMessages.appendChild(div);
  });


  chatMessages.scrollTop = chatMessages.scrollHeight;
});




