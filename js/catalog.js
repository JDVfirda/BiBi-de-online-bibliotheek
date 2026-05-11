const catalog = document.getElementById('catalog');


// Load books from backend
function loadBooks() {
    fetch('backend/boeken.php')
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => console.error('Fout bij laden boeken:', error));
}


// Render books
function displayBooks(list) {

    if (!catalog) return;

    catalog.innerHTML = '';

    list.forEach(book => {

        const frontCover = `images/covers/${book.isbn}_front.jpg`;
        const backCover = `images/covers/${book.isbn}_back.jpg`;

        catalog.innerHTML += `
            <div class="col-12 col-md-6 mb-4">
                <div class="card book-card" 
                     data-book='${JSON.stringify(book)}'
                     data-front="${frontCover}"
                     data-back="${backCover}">

                    <div class="book-card-body p-3">

                        <img 
                            src="${frontCover}" 
                            class="img-fluid mb-3 rounded"
                            style="height:250px; width:100%; object-fit:contain;"
                            onerror="this.src='images/covers/default.jpg'"
                        >

                        <div class="book-card-title fw-semibold mb-1">
                            ${book.titel}
                        </div>

                        <div class="book-card-author text-muted mb-2">
                            ${book.auteur}
                        </div>

                        <div class="book-card-uitgever text-muted mb-1">
                            <small>${book.uitgever}</small>
                        </div>

                        <div class="book-card-jaar text-muted mb-1">
                            <small>${book.jaar}</small>
                        </div>

                        <div class="book-card-genre text-muted mb-2">
                            <small>${book.genre}</small>
                        </div>

                        <button class="btn btn-outline-primary w-100 view-book-btn">
                            Bekijk boek
                        </button>

                    </div>
                </div>
            </div>
        `;
    });
}

// Event delegation for modal buttons
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-book-btn")) {
        const card = e.target.closest(".book-card");
        const book = JSON.parse(card.dataset.book);

book.cover_front = card.dataset.front;
book.cover_back = card.dataset.back;

openBookModal(book);
    }
});


// Open Bootstrap modal
function openBookModal(book) {

    document.getElementById("modalTitle").innerText = book.titel;
    document.getElementById("modalAuthor").innerText = book.auteur;
    document.getElementById("modalPublisher").innerText = book.uitgever;
    document.getElementById("modalYear").innerText = book.jaar;
    document.getElementById("modalGenre").innerText = book.genre;
    document.getElementById("modalISBN").innerText = book.isbn;

    const img = document.getElementById("modalImage");

    // Default image = front
    img.src = book.cover_front;

    // Front button
    document.getElementById("showFront").onclick = () => {
        img.src = book.cover_front;
    };

    // Back button
    document.getElementById("showBack").onclick = () => {
        img.src = book.cover_back;
    };

    // Zoom functionality
    let zoomed = false;

    img.onclick = () => {
        zoomed = !zoomed;

        if (zoomed) {
            img.style.transform = "scale(2)";
            img.style.cursor = "zoom-out";
        } else {
            img.style.transform = "scale(1)";
            img.style.cursor = "zoom-in";
        }
    };

    const modal = new bootstrap.Modal(document.getElementById('bookModal'));
    modal.show();
}



// Search filter
const searchInput = document.getElementById("search");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        const cards = document.querySelectorAll('.book-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const wrapper = card.closest('.col-12');

            if (wrapper) {
                wrapper.style.display = text.includes(value) ? '' : 'none';
            }
        });
    });
}


// Start loading books
if (catalog) {
    loadBooks();
}

console.log("catalog.js loaded");