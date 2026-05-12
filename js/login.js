// Een programma waarmee een gebruiker kan inloggen en uitloggen.
// De data wordt verstuurd naar login.php

function login(event) {
    event.preventDefault();

    const gebruikersnaam = document.getElementById('login-gebruikersnaam').value;
    const wachtwoord = document.getElementById('login-wachtwoord').value;

    fetch('backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            login: gebruikersnaam,
            wachtwoord: wachtwoord
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
  
            localStorage.setItem('ingelogd', true);
            localStorage.setItem('voornaam', data.klant.voornaam);
            localStorage.setItem('gebruikersnaam', data.klant.gebruikersnaam);

            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();

            location.reload();
        } else {
            document.getElementById('login-melding').innerHTML = `
                <div class="alert alert-danger">${data.fout}</div>
            `;
        }
    })
    .catch(error => console.error('Fout bij inloggen:', error));
}

// Controleer bij het laden van de pagina of de gebruiker ingelogd is
function controleerIngelogd() {
    const ingelogd = localStorage.getItem('ingelogd');
    const voornaam = localStorage.getItem('voornaam');

    if (ingelogd) {
        document.getElementById('nav-login').classList.add('d-none');
        document.getElementById('nav-gebruiker').classList.remove('d-none');
        document.getElementById('nav-voornaam').textContent = voornaam;
    }
}

function uitloggen() {
    // Verwijder alle gegevens uit localStorage
    localStorage.removeItem('ingelogd');
    localStorage.removeItem('voornaam');
    localStorage.removeItem('gebruikersnaam');

    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    controleerIngelogd();
});