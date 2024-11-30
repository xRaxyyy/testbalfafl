// Import Firebase functionalities
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFpo8mRXewVlI1PvOVrvjuHEaMefncqsc",
  authDomain: "vuurwerkduitsland-cc0bb.firebaseapp.com",
  projectId: "vuurwerkduitsland-cc0bb",
  storageBucket: "vuurwerkduitsland-cc0bb.appspot.com",
  messagingSenderId: "17574620825",
  appId: "1:17574620825:web:bdb55900ffc50f928dd208",
  measurementId: "G-Z2VGST04S8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle user sign-up
function handleSignup(event) {
    event.preventDefault(); // Prevent the form from submitting
    const email = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Sign-up successful! You can now log in.");
            document.getElementById('signup-container').classList.add('hidden'); // Hide signup form
            document.getElementById('popup-container').classList.remove('hidden'); // Show login form
        })
        .catch((error) => {
            alert(`Sign-up failed: ${error.message}`);
        });
}

// Function to handle user login
function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert(`Logged in successfully as ${userCredential.user.email}`);
        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found') {
                alert("Login failed: No account found with this email.");
            } else {
                alert(`Login failed: ${error.message}`);
            }
        });
}

// Show signup form when "sign up here" link is clicked
document.getElementById('show-signup').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    document.getElementById('popup-container').classList.add('hidden'); // Hide login form
    document.getElementById('signup-container').classList.remove('hidden'); // Show signup form
});

// Show login form when "login here" link is clicked
document.getElementById('show-login').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    document.getElementById('signup-container').classList.add('hidden'); // Hide signup form
    document.getElementById('popup-container').classList.remove('hidden'); // Show login form
});
