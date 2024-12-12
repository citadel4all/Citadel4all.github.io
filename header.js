const header = document.querySelector(".header");
  header.innerHTML = "";
  
    header.innerHTML += `
      <nav class="navbar">
      <a href="index.html" class="logo">Fiction Hub</a>
      <div class="menu-toggle" id="menu-toggle">☰</div>
      <div class="nav-overlay" id="nav-overlay"></div>
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="library.html">Library</a></li>
        <li><a href="create.html">Create</a></li>
        <li><a href="editor.html">Editor</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="" id="logout-button">Sign out</a></li>
      </ul>
    </nav>
    `;
    
    
const logoutButton = document.getElementById('logout-button'); // Assuming you have a logout button
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            // Sign-out successful
            console.log("User signed out");
            // Redirect to the login page or any other page
            window.location.href = 'login.html';
        })
        .catch((error) => {
            // An error happened
            console.error("Error signing out:", error);
        });
});