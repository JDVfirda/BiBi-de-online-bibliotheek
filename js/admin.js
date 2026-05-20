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
                            <button class="btn btn-sm btn-warning me-1" onclick="editKlant(${klant.id}, '${klant.voornaam}', '${klant.achternaam}', 
                            '${klant.gebruikersnaam}', '${klant.email}', '${klant.telefoon}', ${klant.is_admin})">
                            Bewerken
                            </button>
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

// Open de edit modal met de huidige gegevens
function editKlant(id, voornaam, achternaam, gebruikersnaam, email, telefoon, is_admin) {
    document.getElementById('edit-klant-id').value = id;
    document.getElementById('edit-voornaam').value = voornaam;
    document.getElementById('edit-achternaam').value = achternaam;
    document.getElementById('edit-gebruikersnaam').value = gebruikersnaam;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-telefoon').value = telefoon ?? '';
    document.getElementById('edit-is-admin').checked = is_admin == 1;

    new bootstrap.Modal(document.getElementById('modalKlantBewerken')).show();
}

// Sla de gewijzigde klantgegevens op
function klantOpslaan() {
    const klant = {
        id: document.getElementById('edit-klant-id').value,
        voornaam: document.getElementById('edit-voornaam').value,
        achternaam: document.getElementById('edit-achternaam').value,
        gebruikersnaam: document.getElementById('edit-gebruikersnaam').value,
        email: document.getElementById('edit-email').value,
        telefoon: document.getElementById('edit-telefoon').value,
        is_admin: document.getElementById('edit-is-admin').checked ? 1 : 0
    };

    fetch('backend/klanten.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(klant)
    })
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                bootstrap.Modal.getInstance(document.getElementById('modalKlantBewerken')).hide();
                laadKlanten();
            } else {
                document.getElementById('edit-klant-melding').innerHTML = `
                <div class="alert alert-danger">${data.fout}</div>
            `;
            }
        })
        .catch(error => console.error('Fout bij opslaan klant:', error));
}

// Haal alle uitleningen op
function laadUitleningen() {
    fetch('backend/uitleningen.php')
        .then(response => response.json())
        .then(uitleningen => {
            const tabel = document.getElementById('tabel-uitleningen');
            tabel.innerHTML = '';

            uitleningen.forEach(uitlening => {
                tabel.innerHTML += `
                    <tr>
                        <td>${uitlening.titel}</td>
                        <td>${uitlening.voornaam} ${uitlening.achternaam}</td>
                        <td>${uitlening.datum_uit}</td>
                        <td>${uitlening.datum_terug ?? 'Nog niet terug'}</td>
                        <td>
                            <span class="badge ${uitlening.status === 'uitgeleend' ? 'bg-danger' : 'bg-success'}">
                                ${uitlening.status}
                            </span>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Fout bij laden uitleningen:', error));
}

// Laad de pagina en vul de tabellen met boeken en klanten
document.addEventListener('DOMContentLoaded', function () {
    laadBoeken();
    laadKlanten();
    laadUitleningen();
});