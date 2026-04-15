



const mybooks = document.getElementById('mybooks');
if (mybooks) {
    displayMyBooks(myBooksList);
}

const myBooksList = [
  { title: "No books yet :(", author: "", img: "https://via.placeholder.com/150x200" }
];

function displayMyBooks(list) {
  mybooks.innerHTML = '';
  list.forEach(book => {
    mybooks.innerHTML += `
      <div class="col-12 col-md-6 mb-4">
        <div class="card book-card">
          <img src="${book.img}" alt="${book.title}">
          <div class="book-card-body">
            <div class="book-card-title">${book.title}</div>
            <div class="book-card-author">${book.author}</div>
          </div>
        </div>
      </div>
    `;
  });
}

displayMyBooks(myBooksList);