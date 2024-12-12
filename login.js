import { auth } from './firebase-initializer.js'; // Import auth object

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('loginMessage'); // Get the message element

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginMessage.textContent = "Logging in... Please wait."; // Show loading message

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed in successfully
            const user = userCredential.user;
            console.log("User signed in:", user);
            loginMessage.textContent = ""; // Clear the message
            // Redirect to the desired page after successful login
            window.location.href = 'create.html'; // Or any other page
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", error);
            loginMessage.textContent = errorMessage; // Display error message
        });
});
