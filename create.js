// create.js
import { auth, db } from './firebase-initializer.js'; // Import auth and db objects
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Get references to DOM elements
const message = document.getElementById('message');
const addBookForm = document.getElementById('add-book-form');
const chapterInputs = document.getElementById('chapter-inputs');
const addChapterButton = document.getElementById('add-chapter-button');

// Add Chapter Button
let chapterCount = 1; // Start with chapter 1

addChapterButton.addEventListener('click', () => {
  chapterCount++;
  const newChapterInput = document.createElement('div');
  newChapterInput.classList.add('chapter-input');
  newChapterInput.dataset.chapterId = chapterCount;
  newChapterInput.innerHTML = `
    <label for="chapter-title-${chapterCount}">Chapter Title</label>
    <input type="text" id="chapter-title-${chapterCount}" placeholder="Enter chapter title" required>
    <label for="chapter-content-${chapterCount}">Chapter Content</label>
    <textarea id="chapter-content-${chapterCount}" placeholder="Enter chapter content" required></textarea>
    <button type="button" class="delete-chapter-button" data-chapter-id="${chapterCount}">Delete</button>
  `;
  chapterInputs.appendChild(newChapterInput);

  // Re-initialize Sortable.js after adding a new chapter
  new Sortable(chapterInputs, {
    animation: 150, // Add a smooth animation
    handle: '.delete-chapter-button', // Make the delete button the handle
    onEnd: (evt) => {
      // Update the chapter IDs after reordering
      const chapterInputs = document.querySelectorAll('.chapter-input');
      chapterInputs.forEach((chapterInput, index) => {
        chapterInput.dataset.chapterId = index + 1;
        chapterInput.querySelector('.delete-chapter-button').dataset.chapterId = index + 1;
        chapterInput.querySelector(`#chapter-title-${index + 1}`).id = `chapter-title-${index + 1}`;
        chapterInput.querySelector(`#chapter-content-${index + 1}`).id = `chapter-content-${index + 1}`;
      });
    }
  });
});

// Delete Chapter Button
chapterInputs.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-chapter-button')) {
    const chapterId = event.target.dataset.chapterId;
    const chapterInput = event.target.closest('.chapter-input');
    chapterInputs.removeChild(chapterInput);
    // Update chapterCount if needed (optional)
  }
});

// Get a reference to the storage service
const storage = getStorage();

// Event listener for adding a new book
addBookForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from submitting normally

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const summary = document.getElementById('summary').value;

  const chapters = [];
  const chapterInputs = document.querySelectorAll('.chapter-input');
  chapterInputs.forEach(chapterInput => {
    const chapterTitle = chapterInput.querySelector(`#chapter-title-${chapterInput.dataset.chapterId}`).value;
    const chapterContent = chapterInput.querySelector(`#chapter-content-${chapterInput.dataset.chapterId}`).value;
    if (chapterTitle && chapterContent) {
      chapters.push({ title: chapterTitle, content: chapterContent });
    }
  });

  const bookImage = document.getElementById('bookImage').files[0];

  // Show a loading message
  message.textContent = "Adding book... Please wait.";

  if (bookImage) {
    // Upload the image to Firebase Storage
    const imageRef = ref(storage, `bookImages/${bookImage.name}`);
    uploadBytes(imageRef, bookImage)
      .then((snapshot) => {
        // Get the download URL of the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            // Store the book data in Firestore, including the image URL
            db.collection('bookCollection').add({
              title: title,
              author: author,
              genre: genre,
              summary: summary,
              chapters: chapters,
              imageUrl: downloadURL // Store the image URL
            })
            .then(docRef => {
              console.log("Document written with ID:", docRef.id);
              message.textContent = "Book added successfully!";
              addBookForm.reset(); // Clear the form
              chapterCount = 1; // Reset chapter count
              chapterInputs.innerHTML = ''; // Clear chapter inputs
              // Refresh the book list (you'll need to implement this function)
              fetchBooks(); 
            })
            .catch(error => {
              console.error("Error adding document:", error);
              message.textContent = "An error occurred while adding the book.";
            });
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            message.textContent = "An error occurred while getting the image URL.";
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        message.textContent = "An error occurred while uploading the image.";
      });
  } else {
    // Store the book data without an image
    db.collection('bookCollection').add({
      title: title,
      author: author,
      genre: genre,
      summary: summary,
      chapters: chapters
    })
    .then(docRef => {
      console.log("Document written with ID:", docRef.id);
      message.textContent = "Book added successfully!";
      addBookForm.reset(); // Clear the form
      chapterCount = 1; // Reset chapter count
      chapterInputs.innerHTML = ''; // Clear chapter inputs
      // Refresh the book list (you'll need to implement this function)
      fetchBooks(); 
    })
    .catch(error => {
      console.error("Error adding document:", error);
      message.textContent = "An error occurred while adding the book.";
    });
  }
});

// Check if the user is logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in
        console.log("User is logged in:", user);
        // Allow access to the create page
        // ... (Your create page logic)
    } else {
        // User is not logged in
        console.log("User is not logged in");
        // Redirect to the login page
        window.location.href = 'login.html';
    }
});
