const catalog = document.getElementById('catalog');

const books = [
  { title: "Harry Potter", author: "J.K. Rowling", img: "https://via.placeholder.com/150x200" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", img: "https://via.placeholder.com/150x200" },
  { title: "1984", author: "George Orwell", img: "https://via.placeholder.com/150x200" },
  { title: "The Alchemist", author: "Paulo Coelho", img: "https://via.placeholder.com/150x200" },
  { title: "Clean Code", author: "Robert C. Martin", img: "https://via.placeholder.com/150x200" },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", img: "https://via.placeholder.com/150x200" },
  { title: "Pride and Prejudice", author: "Jane Austen", img: "https://via.placeholder.com/150x200" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", img: "https://via.placeholder.com/150x200" },
  { title: "The Da Vinci Code", author: "Dan Brown", img: "https://via.placeholder.com/150x200" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", img: "https://via.placeholder.com/150x200" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", img: "https://via.placeholder.com/150x200" },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", img: "https://via.placeholder.com/150x200" },
  { title: "The Shining", author: "Stephen King", img: "https://via.placeholder.com/150x200" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", img: "https://via.placeholder.com/150x200" }
];

function displayBooks(list) {
  if (!catalog) return; // Only run if element exists
  catalog.innerHTML = '';
  list.forEach(book => {
    catalog.innerHTML += `
      <div class="col-12 col-md-6 mb-4">
        <div class="card book-card">
          <img src="${book.img}" alt="${book.title}">
          <div class="book-card-body">
            <div class="book-card-title">${book.title}</div>
            <div class="book-card-author">${book.author}</div>
            <button class="btn btn-outline-primary w-100">Bekijk boek</button>
          </div>
        </div>
      </div>
    `;
  });
}

// ONLY run if catalog exists
if (catalog) {
    displayBooks(books);

    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        const filtered = books.filter(book =>
          book.title.toLowerCase().includes(value) ||
          book.author.toLowerCase().includes(value)
        );
        displayBooks(filtered);
      });
    }
}