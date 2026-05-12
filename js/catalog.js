const catalog = document.getElementById('catalog');

let modalState = {
    zoomed: false
};

// -------------------------
// LOAD BOOKS
// -------------------------
function loadBooks() {
    fetch('backend/boeken.php')
        .then(r => r.json())
        .then(data => {
            if (!Array.isArray(data)) return console.error("Bad data:", data);
            renderBooks(data);
        })
        .catch(err => console.error(err));
}

// -------------------------
// RENDER
// -------------------------
function renderBooks(books) {
    catalog.innerHTML = '';

    books.forEach(book => {

        const front = `images/covers/${book.isbn}_front.jpg`;
        const back = `images/covers/${book.isbn}_back.jpg`;

        catalog.insertAdjacentHTML('beforeend', `
            <div class="col-12 col-md-6 mb-4">
                <div class="card book-card"
                    data-book='${JSON.stringify(book).replace(/'/g, "&apos;")}'
                    data-front="${front}"
                    data-back="${back}">

                    <div class="book-card-body p-3">

                        <img src="${front}"
                             class="img-fluid mb-3 rounded"
                             style="height:250px;width:100%;object-fit:contain;"
                             onerror="this.src='images/covers/default.png'">

                        <div class="fw-semibold">${book.titel}</div>
                        <div class="text-muted">${book.auteur}</div>

                        <button class="btn btn-outline-primary w-100 view-book-btn mt-3">
                            Bekijk boek
                        </button>

                    </div>
                </div>
            </div>
        `);
    });
}

// -------------------------
// CLICK HANDLER (single source)
// -------------------------
document.addEventListener('click', (e) => {

    const btn = e.target.closest('.view-book-btn');
    if (!btn) return;

    const card = btn.closest('.book-card');
    const book = JSON.parse(card.dataset.book);

    book.cover_front = card.dataset.front;
    book.cover_back = card.dataset.back;

    openModal(book);
});

// -------------------------
// MODAL LOGIC (clean reset)
// -------------------------
function openModal(book) {

    const title = document.getElementById("modalTitle");
    const author = document.getElementById("modalAuthor");
    const publisher = document.getElementById("modalPublisher");
    const year = document.getElementById("modalYear");
    const genre = document.getElementById("modalGenre");
    const isbn = document.getElementById("modalISBN");
    const pages = document.getElementById("modalPages");

    const img = document.getElementById("modalImage");
    const backBtn = document.getElementById("showBack");
    const frontBtn = document.getElementById("showFront");

    // reset state EVERY TIME
    modalState.zoomed = false;

    function setImage(src) {
        modalState.zoomed = false;
        img.style.transform = "scale(1)";
        img.style.cursor = "zoom-in";
        img.src = src;
    }

    // fill modal
    title.textContent = book.titel;
    author.textContent = `${book.auteur} (${book.taal})`;
    publisher.textContent = book.uitgever;
    year.textContent = book.publicatiedatum;
    genre.textContent = book.genre;
    isbn.textContent = book.isbn;
    pages.textContent = book.pagina_aantal;

    // default image
    setImage(book.cover_front);

    // Display frontside button
    frontBtn.onclick = () => setImage(book.cover_front);

    //Display backside button if image exists, else hide
    backBtn.style.display = "none";
    backBtn.onclick = null;

    const test = new Image();
    test.src = book.cover_back;

    test.onload = () => {
        backBtn.style.display = "inline-block";
        backBtn.onclick = () => setImage(book.cover_back);
    };

    test.onerror = () => {
        backBtn.style.display = "none";
    };

    // zoom
    img.onclick = () => {
        modalState.zoomed = !modalState.zoomed;
        img.style.transform = modalState.zoomed ? "scale(2)" : "scale(1)";
        img.style.cursor = modalState.zoomed ? "zoom-out" : "zoom-in";
    };

    new bootstrap.Modal(document.getElementById('bookModal')).show();
}

// -------------------------
// SEARCH
// -------------------------
document.getElementById("search")?.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll('.book-card').forEach(card => {
        const match = card.textContent.toLowerCase().includes(value);
        card.closest('.col-12').style.display = match ? '' : 'none';
    });
});

// -------------------------
// INIT
// -------------------------
if (catalog) loadBooks();

console.log("catalog.js loaded clean version");