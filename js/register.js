// Een programma waarmee een gebruiker zich kan registreren
// De data wordt vervolgens gestuurd naar klanten.php

function registreer(event) {
    event.preventDefault();

    const voornaam = document.getElementById('voornaam').value;
    const achternaam = document.getElementById('achternaam').value;
    const gebruikersnaam = document.getElementById('gebruikersnaam').value;
    const email = document.getElementById('email').value;
    const telefoonnummer = document.getElementById('telefoonnummer').value;
    const wachtwoord = document.getElementById('wachtwoord').value;
    const wachtwoord_herhaald = document.getElementById('wachtwoord_herhaald').value;

    if (wachtwoord !== wachtwoord_herhaald) {
        alert('De wachtwoorden komen niet overeen. Probeer het opnieuw.');
        return;
    }

    fetch('../backend/klanten.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            voornaam: voornaam,
            achternaam: achternaam,
            gebruikersnaam: gebruikersnaam,
            email: email,
            telefoonnummer: telefoonnummer,
            wachtwoord: wachtwoord
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
            alert('Je account is aangemaakt! Je kunt nu inloggen.');
        } else {
            alert('Er is een fout opgetreden bij het aanmaken van je account. Probeer het later opnieuw.');
        }
    })
    .catch(error => console.error('Error:', error));
}