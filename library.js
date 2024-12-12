// Get references to DOM elements
const bookCarousel = document.getElementById('book-carousel');
const searchBar = document.getElementById('search-bar');
const filterGenre = document.getElementById('filter-genre');
const message = document.getElementById('message');

// Function to display books in the carousel
function displayBooks(books) {
  bookCarousel.innerHTML = ''; // Clear existing book cards

  if (books.length === 0) {
    const noBooksMessage = document.createElement('p');
    noBooksMessage.textContent = 'No books found.';
    noBooksMessage.classList.add('no-books');
    bookCarousel.appendChild(noBooksMessage);
    return;
  }

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Genre: ${book.genre}</p>
      <a href="reader.html?id=${book.id}" class="read-button">Read</a>
      <a href="#" onclick="deleteBook('${book.id}')" class="delete-button">Delete</a> 
      <a href="editor.html?id=${book.id}" class="edit-button">Edit</a> 
    `;
    bookCarousel.appendChild(bookCard);
  });
}

// Loading Indicator
const loadingIndicator = document.getElementById("loading-indicator");
loadingIndicator.style.display = "block"; // Show loading indicator

// Function to fetch books from Firestore
function fetchBooks(query) {
  let booksRef = db.collection('bookCollection');

  if (query) {
    booksRef = booksRef.where('title', '>=', query)
                       .where('title', '<=', query + '\uf8ff'); // Case-insensitive search
  }

  const genre = filterGenre.value;
  if (genre !== 'all') {
    booksRef = booksRef.where('genre', '==', genre);
  }

  booksRef.get()
    .then(snapshot => {
      const books = [];
      snapshot.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id });
      });
      loadingIndicator.style.display = "none";
      displayBooks(books);
    })
    .catch(error => {
      console.error("Error fetching books:", error);
      message.textContent = "An error occurred while loading books.";
    });
}

// Event listener for search bar
searchBar.addEventListener('input', () => {
  const query = searchBar.value.trim();
  fetchBooks(query);
});

// Event listener for genre filter
filterGenre.addEventListener('change', () => {
  fetchBooks();
});

// Initial fetch of books
fetchBooks();

//Delete a book
async function deleteBook(bookId) {
  try {
    await db.collection('bookCollection').doc(bookId).delete();
    fetchBooks(); // Refresh the book list
  } catch (error) {
    console.error("Error deleting book:", error);
  }
}
