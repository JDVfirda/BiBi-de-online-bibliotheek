// Een programma waarmee een gebruiker kan inloggen
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