const catalog = document.getElementById('catalog');


function loadBooks() {
    fetch('../backend/boeken.php')
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => console.error('Fout bij laden boeken:', error));
}


function displayBooks(list) {
    if (!catalog) return;
    catalog.innerHTML = '';
    list.forEach(book => {
        catalog.innerHTML += `
            <div class="col-12 col-md-6 mb-4">
                <div class="card book-card">
                    <div class="book-card-body p-3">
                        <div class="book-card-title fw-semibold mb-1">${book.titel}</div>
                        <div class="book-card-author text-muted mb-2">${book.auteur}</div>
                        <div class="book-card-uitgever text-muted mb-1"><small>${book.uitgever}</small></div>
                        <div class="book-card-jaar text-muted mb-1"><small>${book.jaar}</small></div>
                        <div class="book-card-genre text-muted mb-2"><small>${book.genre}</small></div>
                        <button class="btn btn-outline-primary w-100">Bekijk boek</button>
                    </div>
                </div>
            </div>
        `;
    });
}


const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        const rijen = document.querySelectorAll('.book-card');
        rijen.forEach(rij => {
            const tekst = rij.textContent.toLowerCase();
            rij.closest('.col-12').style.display = tekst.includes(value) ? '' : 'none';
        });
    });
}


if (catalog) {
    loadBooks();
}