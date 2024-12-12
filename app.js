// Fetch Books from Firestore
async function fetchBooks() {
  const bookGrid = document.querySelector(".book-grid");
  bookGrid.innerHTML = "";

  try {
    const querySnapshot = await db.collection('bookCollection').get();

    if (querySnapshot.empty) {
      bookGrid.innerHTML = "<p class='no-books'>No books found. Add new books or adjust the search/filter criteria.</p>";
      return;
    }

    querySnapshot.docs.forEach(doc => {
      const book = doc.data();
      bookGrid.innerHTML += `
        <div class="book-card" data-id="${doc.id}" >
          <h3><a href="reader.html?id=${doc.id}">${book.title}</a></h3>
          <p>Author: ${book.author}</p>
          <p>Genre: ${book.genre}</p>
          <button onclick="deleteBook('${doc.id}')">Delete</button>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    bookGrid.innerHTML = "<p class='error'>An error occurred while fetching books. Please try again later.</p>";
  }
}

if (document.querySelector(".book-grid")) fetchBooks();

async function deleteBook(bookId) {
  try {
    await db.collection('bookCollection').doc(bookId).delete();
    fetchBooks(); // Refresh the book list
  } catch (error) {
    console.error("Error deleting book:", error);
  }
}