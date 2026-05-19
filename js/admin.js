// Een programma waarmee de admin boeken en klanten kan beheren

// Haal alle boeken op uit de database en vul de tabel
function laadBoeken() {
    fetch('backend/boeken.php')
        .then(response => response.json())
        .then(boeken => {
            const tabel = document.getElementById('tabel-boeken');
            tabel.innerHTML = '';

            boeken.forEach(boek => {
                tabel.innerHTML += `
                    <tr>
                        <td>${boek.titel}</td>
                        <td>${boek.auteur}</td>
                        <td>${boek.uitgever}</td>
                        <td>${boek.taal}</td>
                        <td>${boek.genre}</td>
                        <td>${boek.pagina_aantal}</td>
                        <td>${boek.publicatiedatum}</td>
                        <td>${boek.isbn}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="verwijderBoek(${boek.id})">
                                Verwijderen
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Fout bij laden boeken:', error));
}

// Voeg een nieuw boek toe aan de database
function boekToevoegen() {
    const boek = {
        titel: document.getElementById('boek-titel').value,
        auteur: document.getElementById('boek-auteur').value,
        uitgever: document.getElementById('boek-uitgever').value,
        taal: document.getElementById('boek-taal').value,
        pagina_aantal: document.getElementById('boek-aantal-paginas').value,
        genre: document.getElementById('boek-genre').value,
        isbn: document.getElementById('boek-isbn').value,
        publicatiedatum: document.getElementById('boek-publicatie-datum').value
    };

    fetch('backend/boeken.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boek)
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
            bootstrap.Modal.getInstance(document.getElementById('modalBoekToevoegen')).hide();
            laadBoeken();
        } else {
            document.getElementById('boek-melding').innerHTML = `
                <div class="alert alert-danger">${data.fout}</div>
            `;
        }
    })
    .catch(error => console.error('Fout bij toevoegen boek:', error));
}

// Verwijder een boek uit de database
function verwijderBoek(id) {
    if (!confirm('Weet je zeker dat je dit boek wilt verwijderen?')) return;

    fetch('backend/boeken.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
            laadBoeken();
        } else {
            alert('Er ging iets mis: ' + data.fout);
        }
    })
    .catch(error => console.error('Fout bij verwijderen boek:', error));
}

// Haal alle klanten op uit de database en vul de tabel
function laadKlanten() {
    fetch('backend/klanten.php')
        .then(response => response.json())
        .then(klanten => {
            const tabel = document.getElementById('tabel-klanten');
            tabel.innerHTML = '';

            klanten.forEach(klant => {
                tabel.innerHTML += `
                    <tr>
                        <td>${klant.voornaam} ${klant.achternaam}</td>
                        <td>${klant.gebruikersnaam}</td>
                        <td>${klant.email}</td>
                        <td>${klant.telefoon ?? '-'}</td>
                        <td>${klant.aanmaak_datum}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="verwijderKlant(${klant.id})">
                                Verwijderen
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Fout bij laden klanten:', error));
}

// Verwijder een klant uit de database
function verwijderKlant(id) {
    if (!confirm('Weet je zeker dat je deze klant wilt verwijderen?')) return;

    fetch('backend/klanten.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
            laadKlanten();
        } else {
            alert('Er ging iets mis: ' + data.fout);
        }
    })
    .catch(error => console.error('Fout bij verwijderen klant:', error));
}

// Laad de pagina en vul de tabellen met boeken en klanten
document.addEventListener('DOMContentLoaded', function () {
    laadBoeken();
    laadKlanten();
});