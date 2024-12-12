import { auth } from './firebase-initializer.js'; // Import auth object

const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signupMessage'); // Get the message element

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signupMessage.textContent = "Creating account... Please wait."; // Show loading message

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User created successfully
            const user = userCredential.user;
            console.log("User created:", user);
            signupMessage.textContent = ""; // Clear the message
            // Redirect to the desired page after successful signup
            window.location.href = 'login.html'; // Or any other page
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error creating user:", error);
            signupMessage.textContent = errorMessage; // Display error message
        });
});
