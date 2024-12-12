import { auth } from './firebase-initializer.js'; // Import auth object

const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotPasswordMessage = document.getElementById('forgotPasswordMessage'); // Get the message element

forgotPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;

    forgotPasswordMessage.textContent = "Sending password reset email... Please wait."; // Show loading message

    auth.sendPasswordResetEmail(email)
        .then(() => {
            // Password reset email sent successfully
            console.log("Password reset email sent successfully");
            forgotPasswordMessage.textContent = "Password reset email sent. Check your inbox.";
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error sending password reset email:", error);
            forgotPasswordMessage.textContent = errorMessage; // Display error message
        });
});
