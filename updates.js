import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const usersData = {
  "ronichen63@gmail.com": {
    name: "Roni Chen",
    photo: "roni_img.jpg"
  },
  "nivg77@gmail.com": {
    name: "Niv Gottfried",
    photo: "niv_img.jpeg"
  }
};

function showMessage(text, color = "green") {
  const msgDiv = document.getElementById("status-message");
  
  msgDiv.textContent = text;
  msgDiv.style.color = color;
  msgDiv.style.display = "block";
  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 3000);
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showMessage("You need to log in first.", "red");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
    return;
  }

  // שליחת עדכון
  document.getElementById("send-btn").addEventListener("click", async () => {
    const message = document.getElementById("message").value.trim();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

    let fileUrl = "";
    let fileType = "";

    try {
      if (file) {
        const storageRef = sRef(storage, `uploads/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
        fileType = file.type;
      }

      if (!message && !fileUrl) {
        return showMessage("Please write an update or upload a file.", "red");
      }

      await push(ref(db, "updates"), {
        user: usersData[user.email]?.name || user.email,
        photo: usersData[user.email]?.photo || "images/default.jpg",
        text: message,
        fileUrl: fileUrl,
        fileType: fileType,
        time: new Date().toISOString()
      });

      document.getElementById("message").value = "";
      if (fileInput) fileInput.value = "";
      showMessage("✅ Update sent successfully!", "green");
    } catch (error) {
      console.error("Upload Error:", error);
      showMessage("❌ Failed to send update.", "red");
    }
  });
});
onValue(ref(db, "updates"), (snapshot) => {
  const updatesContainer = document.getElementById("updates-container");
  updatesContainer.innerHTML = ""; 
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    updatesContainer.innerHTML += `
      <div class="update-item">
        <div class="user-info">
          <img src="${data.photo}" class="user-photo" alt="${data.user}">
          <span class="user-name">${data.user}</span>
        </div>
        <p class="message-text">${data.text}</p>
        ${
          data.fileUrl
            ? data.fileType.startsWith("image/")
              ? `<img src="${data.fileUrl}" class="uploaded-image" alt="uploaded">`
              : `<a href="${data.fileUrl}" target="_blank" class="uploaded-file">📎 View File</a>`
            : ""
        }
      </div>
    `;
  });
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  showMessage("Logged out successfully!", "green");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});

