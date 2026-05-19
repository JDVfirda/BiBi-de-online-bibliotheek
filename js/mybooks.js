const mybooks = document.getElementById('mybooks');

function loadMyBooks() {
    const klant_id = localStorage.getItem("klant_id");

    if (!klant_id) return;

    fetch(`backend/mijn_boeken.php?klant_id=${klant_id}`)
        .then(r => r.json())
        .then(data => displayMyBooks(data))
        .catch(err => console.error(err));
}

function displayMyBooks(list) {
    mybooks.innerHTML = '';

    if (!list.length) {
        mybooks.innerHTML = `<p class="text-muted">Je hebt nog geen boeken.</p>`;
        return;
    }

    list.forEach(book => {
        mybooks.innerHTML += `
            <div class="col-12 col-md-6 mb-4">
                <div class="card book-card">
                    <div class="book-card-body p-3">

                        <div class="fw-semibold">${book.titel}</div>
                        <div class="text-muted">${book.auteur}</div>

                        <span class="badge bg-${
                            book.status === 'geleend' ? 'primary' : 'warning'
                        }">
                            ${book.status}
                        </span>

                        <div class="mt-2">
                            ${
                                book.status === "geleend"
                                    ? `<button class="btn btn-sm btn-success" onclick="returnBook(${book.id})">Terugbrengen</button>`
                                    : `<button class="btn btn-sm btn-warning" onclick="cancelReservation(${book.id})">Annuleren</button>`
                            }
                        </div>

                    </div>
                </div>
            </div>
        `;
    });
}

// ACTIONS
function returnBook(id) {
    fetch("backend/terugbrengen.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            boek_id: id,
            klant_id: localStorage.getItem("klant_id")
        })
    }).then(() => loadMyBooks());
}

function cancelReservation(id) {
    fetch("backend/reservering_annuleren.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            boek_id: id,
            klant_id: localStorage.getItem("klant_id")
        })
    }).then(() => loadMyBooks());
}

// INIT
if (mybooks) loadMyBooks();