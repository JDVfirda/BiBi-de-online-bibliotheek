const catalog = document.getElementById('catalog');

let currentBook = null;

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

        const statusBadge =
            book.beschikbare_kopieen > 0
                ? `<span class="badge bg-success mb-2">Beschikbaar</span>`
                : `<span class="badge bg-danger mb-2">Uitgeleend</span>`;

        const front = `images/covers/${book.isbn}_front.jpg`;
        const back = `images/covers/${book.isbn}_back.jpg`;

        catalog.insertAdjacentHTML('beforeend', `
            <div class="col-12 col-md-6 mb-4">
                <div class="card book-card"
                    data-book='${JSON.stringify(book).replace(/'/g, "&apos;")}'
                    data-front="${front}"
                    data-back="${back}">

                    <div class="book-card-body p-3">
                        ${statusBadge}

                        <img src="${front}"
                             class="img-fluid mb-3 rounded"
                             style="height:250px;width:100%;object-fit:contain;"
                             onerror="this.src='images/covers/default.png'">

                        <div class="fw-semibold">${book.titel}</div>
                        <div class="text-muted">${book.auteur}</div>

                        <button class="btn w-100 view-book-btn mt-3 ${
                            book.beschikbare_kopieen > 0
                                ? "btn-outline-primary"
                                : "btn-warning"
                        }">
                            ${book.beschikbare_kopieen > 0
                                ? "Bekijk & leen boek"
                                : "Reserveren"}
                        </button>

                    </div>
                </div>
            </div>
        `);
    });
}

// -------------------------
// CLICK HANDLER
// -------------------------
document.addEventListener('click', (e) => {

    const btn = e.target.closest('.view-book-btn');
    if (!btn) return;

    const card = btn.closest('.book-card');
    const book = JSON.parse(card.dataset.book);

    book.cover_front = card.dataset.front;
    book.cover_back = card.dataset.back;

    currentBook = book;

    openModal(book);
});

// -------------------------
// MODAL LOGIC
// -------------------------
function openModal(book) {

    currentBook = book;

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

    setImage(book.cover_front);

    frontBtn.onclick = () => setImage(book.cover_front);

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

    img.onclick = () => {
        modalState.zoomed = !modalState.zoomed;
        img.style.transform = modalState.zoomed ? "scale(2)" : "scale(1)";
        img.style.cursor = modalState.zoomed ? "zoom-out" : "zoom-in";
    };

    // -------------------------
    // BORROW / RESERVE BUTTON
    // -------------------------
    const borrowBtn = document.getElementById("borrowBookBtn");

    if (book.beschikbare_kopieen > 0) {
        borrowBtn.textContent = "Leen boek";
        borrowBtn.classList.remove("btn-warning");
        borrowBtn.classList.add("btn-primary");
    } else {
        borrowBtn.textContent = "Reserveren";
        borrowBtn.classList.remove("btn-primary");
        borrowBtn.classList.add("btn-warning");
    }

    borrowBtn.onclick = () => {

        const klant_id = localStorage.getItem("klant_id");

        if (!klant_id) {
            alert("Je moet eerst inloggen.");
            return;
        }

        borrowBtn.disabled = true;
        borrowBtn.textContent = "Bezig...";

        const endpoint = book.beschikbare_kopieen > 0
            ? "backend/uitleningen.php"
            : "backend/reserveringen.php";

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                boek_id: book.id,
                klant_id: klant_id
            })
        })
        .then(r => r.json())
        .then(data => {

            if (data.succes) {
                alert(
                    book.beschikbare_kopieen > 0
                        ? "Boek geleend!"
                        : "Reservering geplaatst!"
                );

                bootstrap.Modal.getInstance(
                    document.getElementById('bookModal')
                ).hide();

            } else {
                alert(data.fout || "Actie mislukt");
            }

            borrowBtn.disabled = false;
            borrowBtn.textContent =
                book.beschikbare_kopieen > 0
                    ? "Leen boek"
                    : "Reserveren";
        })
        .catch(err => {
            console.error(err);
            alert("Server fout");

            borrowBtn.disabled = false;
            borrowBtn.textContent =
                book.beschikbare_kopieen > 0
                    ? "Leen boek"
                    : "Reserveren";
        });
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