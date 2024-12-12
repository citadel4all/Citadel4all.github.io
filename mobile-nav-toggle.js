document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
  });

  navOverlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
  });
});

