// editor.js
import { auth, db } from './firebase-initializer.js'; // Import auth and db objects
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Get Book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Get references to DOM elements
const editBookForm = document.getElementById('edit-book-form');
const chapterInputs = document.getElementById('chapter-inputs');
const addChapterButton = document.getElementById('add-chapter-button');
const bookImageInput = document.getElementById('bookImage');
const imagePreview = document.getElementById('imagePreview');
const currentBookImage = document.getElementById('currentBookImage');
const message = document.getElementById('message'); // Add a message element

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

// Function to load book data into the form
function loadBookData(bookId) {
  message.textContent = "Loading book data... Please wait."; // Show loading message
  db.collection('bookCollection').doc(bookId).get()
    .then(doc => {
      if (doc.exists) {
        const book = doc.data();
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('genre').value = book.genre;
        document.getElementById('summary').value = book.summary;

        // Load chapters
        book.chapters.forEach((chapter, index) => {
          const newChapterInput = document.createElement('div');
          newChapterInput.classList.add('chapter-input');
          newChapterInput.dataset.chapterId = index + 1;
          newChapterInput.innerHTML = `
            <label for="chapter-title-${index + 1}">Chapter Title</label>
            <input type="text" id="chapter-title-${index + 1}" placeholder="Enter chapter title" value="${chapter.title}" required>
            <label for="chapter-content-${index + 1}">Chapter Content</label>
            <textarea id="chapter-content-${index + 1}" placeholder="Enter chapter content" required>${chapter.content}</textarea>
            <button type="button" class="delete-chapter-button" data-chapter-id="${index + 1}">Delete</button>
          `;
          chapterInputs.appendChild(newChapterInput);
        });

        // Initialize Sortable.js for chapter reordering
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

        // Display the current book image
        if (book.imageUrl) {
          currentBookImage.src = book.imageUrl;
        }
        message.textContent = ""; // Clear the loading message
      } else {
        console.error("Book not found:", bookId);
        message.textContent = "Book not found.";
      }
    })
    .catch(error => {
      console.error("Error loading book data:", error);
      message.textContent = "An error occurred while loading book data.";
    });
}

// Function to handle image preview
function handleImagePreview(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    currentBookImage.src = e.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    currentBookImage.src = ''; // Clear preview if no image is selected
  }
}

// Event listener for image input change
bookImageInput.addEventListener('change', handleImagePreview);

// Event listener for saving changes
editBookForm.addEventListener('submit', (event) => {
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

  const bookImage = bookImageInput.files[0];

  // Show a loading message
  message.textContent = "Saving changes... Please wait.";

  if (bookImage) {
    // Upload the image to Firebase Storage
    const imageRef = ref(storage, `bookImages/${bookImage.name}`);
    uploadBytes(imageRef, bookImage)
      .then((snapshot) => {
        // Get the download URL of the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            // Update the book data in Firestore, including the image URL
            db.collection('bookCollection').doc(bookId).update({
              title: title,
              author: author,
              genre: genre,
              summary: summary,
              chapters: chapters,
              imageUrl: downloadURL // Store the image URL
            })
            .then(() => {
              console.log("Book updated successfully:", bookId);
              message.textContent = "Book updated successfully!";
              // Redirect back to the library page after saving
              window.location.href = 'library.html';
            })
            .catch(error => {
              console.error("Error updating book:", error);
              message.textContent = "An error occurred while updating the book.";
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
    // Update the book data without changing the image
    db.collection('bookCollection').doc(bookId).update({
      title: title,
      author: author,
      genre: genre,
      summary: summary,
      chapters: chapters
    })
    .then(() => {
      console.log("Book updated successfully:", bookId);
      message.textContent = "Book updated successfully!";
      // Redirect back to the library page after saving
      window.location.href = 'library.html';
    })
    .catch(error => {
      console.error("Error updating book:", error);
      message.textContent = "An error occurred while updating the book.";
    });
  }
});

// Load book data when the page loads
loadBookData(bookId);

// Check if the user is logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in
        console.log("User is logged in:", user);
        // Allow access to the edit page
        // ... (Your edit page logic)
    } else {
        // User is not logged in
        console.log("User is not logged in");
        // Redirect to the login page
        window.location.href = 'login.html';
    }
});
