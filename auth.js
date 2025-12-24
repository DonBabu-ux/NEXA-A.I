// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth } from "./firebase.js";

/* =====================
   SIGN UP
   ===================== */
window.signUp = function (event) {
  event.preventDefault();

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

/* =====================
   LOGIN
   ===================== */
window.logIn = function (event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      alert("Invalid email or password");
    });
};

/* =====================
   LOGOUT
   ===================== */
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* =====================
   DASHBOARD PROTECTION
   ===================== */
window.protectDashboard = function () {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "login.html";
    } else {
      const userName = document.getElementById("userName");
      if (userName) userName.textContent = user.email;
    }
  });
};
