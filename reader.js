// Get Book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Loading Indicator
const loadingIndicator = document.getElementById("loading-indicator");
loadingIndicator.style.display = "block"; // Show loading indicator

// Get references to DOM elements
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');
const bookGenre = document.getElementById('bookGenre');
const bookSummary = document.getElementById('bookSummary');
const chapterList = document.getElementById('chapter-list');
const chapterContent = document.getElementById('chapter-content');
const prevChapterButton = document.getElementById('prev-chapter');
const nextChapterButton = document.getElementById('next-chapter');
const chapterSelect = document.getElementById('chapter-select');

let currentChapter = 0;
let chapters = [];

// Function to fetch and display book data
function loadBookData(bookId) {
  db.collection('bookCollection').doc(bookId).get()
    .then(doc => {
      loadingIndicator.style.display = "none"; // Hide loading indicator

      if (doc.exists) {
        const book = doc.data();
        bookTitle.textContent = book.title;
        bookAuthor.textContent = "Author: " + book.author;
        bookGenre.textContent = "Genre: " + book.genre;
        bookSummary.textContent = book.summary; // Assuming you have a "summary" field
        chapters = book.chapters; // Store chapters in the global array
        displayChapters();
        displayChapterContent(0); // Display the first chapter
      } else {
        loadingIndicator.style.display = "none"; // Hide loading indicator
        document.getElementById("error-message").textContent = "Book not found.";
      }
    })
    .catch(error => {
      loadingIndicator.style.display = "none"; // Hide loading indicator
      document.getElementById("error-message").textContent = "An error occurred while loading the book.";
      console.error("Error getting document:", error);
    });
}

// Function to display chapters in the navigation
function displayChapters() {
  chapterList.innerHTML = ''; // Clear existing chapter list

  if (chapters.length === 0) {
    const noChaptersMessage = document.createElement('p');
    noChaptersMessage.textContent = 'No chapters found.';
    chapterList.appendChild(noChaptersMessage);
    return;
  }

  const chapterListUl = document.createElement('ul');
  chapters.forEach((chapter, index) => {
    const chapterLi = document.createElement('li');
    chapterLi.classList.add('chapterListItem');
    chapterLi.textContent = chapter.title;
    chapterLi.addEventListener('click', () => {
      displayChapterContent(index);
    });
    chapterListUl.appendChild(chapterLi);
  });
  chapterList.appendChild(chapterListUl);
}

// Function to display the content of a specific chapter
function displayChapterContent(chapterIndex) {
  if (chapterIndex >= 0 && chapterIndex < chapters.length) {
    chapterContent.textContent = chapters[chapterIndex].content;
    currentChapter = chapterIndex;
    updateChapterNavigation();
  }
}

// Function to update the chapter navigation controls
function updateChapterNavigation() {
  prevChapterButton.disabled = currentChapter === 0;
  nextChapterButton.disabled = currentChapter === chapters.length - 1;

  chapterSelect.innerHTML = '';
  chapters.forEach((chapter, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = chapter.title;
    if (index === currentChapter) {
      option.selected = true;
    }
    chapterSelect.appendChild(option);
  });
}

// Event listeners for chapter navigation
prevChapterButton.addEventListener("click", () => {
  displayChapterContent(currentChapter - 1);
});

nextChapterButton.addEventListener("click", () => {
  displayChapterContent(currentChapter + 1);
});

chapterSelect.addEventListener("change", () => {
  displayChapterContent(parseInt(chapterSelect.value));
});

// Font Size Control
const fontSizeSlider = document.getElementById("font-size");
const readerContent = document.querySelector(".reader-content");

fontSizeSlider.addEventListener("input", () => {
  readerContent.style.fontSize = fontSizeSlider.value + "px";
});

// Theme Control
const themeSelect = document.getElementById("theme");
const reader = document.querySelector(".reader");
const chapterListItem = document.querySelector(".chapter-list-item");

themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;
  reader.classList.remove("light", "sepia", "dark"); // Remove existing theme classes
  reader.classList.add(selectedTheme); // Add the selected theme class
  
  chapterListItem.classList.remove("light", "sepia", "dark");
  chapterListItem.classList.add(selectedTheme); 
  
  document.body.classList.remove("light", "sepia", "dark");
  document.body.classList.add(selectedTheme); 
});

// Load book data when the page loads
loadBookData(bookId);
