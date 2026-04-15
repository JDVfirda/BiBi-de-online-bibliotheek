const mybooks = document.getElementById('mybooks');

const myBooksList = [
  { title: "No books yet :(", author: "", img: "https://via.placeholder.com/150x200" }
];

function displayMyBooks(list) {
  if (!mybooks) return; // Safety: only run if element exists

  mybooks.innerHTML = '';
  list.forEach(book => {
    mybooks.innerHTML += `
      <div class="col-12 col-md-6 mb-4">
        <div class="card book-card">
          <img src="${book.img}" alt="${book.title}" class="card-img-top">
          <div class="book-card-body p-3">
            <div class="book-card-title fw-semibold mb-1">${book.title}</div>
            <div class="book-card-author text-muted mb-2">${book.author}</div>
          </div>
        </div>
      </div>
    `;
  });
}

// Initialize only if element exists
if (mybooks) {
  displayMyBooks(myBooksList);
}