// Een programma waarmee een gebruiker zich kan registreren
// De data wordt vervolgens gestuurd naar klanten.php

function registreer(event) {

    event.preventDefault();

    const voornaam = document.getElementById('voornaam');
    const achternaam = document.getElementById('achternaam');
    const gebruikersnaam = document.getElementById('gebruikersnaam');
    const email = document.getElementById('email');
    const telefoonnummer = document.getElementById('telefoonnummer');
    const wachtwoord = document.getElementById('wachtwoord');
    const wachtwoord_herhaald = document.getElementById('wachtwoord_herhaald');

    // trim spaties
    voornaam.value = voornaam.value.trim();
    achternaam.value = achternaam.value.trim();
    gebruikersnaam.value = gebruikersnaam.value.trim();
    email.value = email.value.trim();
    telefoonnummer.value = telefoonnummer.value.trim();

    const velden = [
        voornaam,
        achternaam,
        gebruikersnaam,
        email,
        telefoonnummer,
        wachtwoord,
        wachtwoord_herhaald
    ];

    let geldig = true;

    velden.forEach(veld => {

        veld.classList.remove('is-invalid');

        if (!veld.checkValidity()) {
            veld.classList.add('is-invalid');
            geldig = false;
        }

    });

    // wachtwoorden vergelijken
    if (wachtwoord.value !== wachtwoord_herhaald.value) {

        wachtwoord.classList.add('is-invalid');
        wachtwoord_herhaald.classList.add('is-invalid');

        alert('De wachtwoorden komen niet overeen.');
        geldig = false;
    }

    if (!geldig) return;

    fetch('backend/klanten.php', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            voornaam: voornaam.value,
            achternaam: achternaam.value,
            gebruikersnaam: gebruikersnaam.value,
            email: email.value,
            telefoonnummer: telefoonnummer.value,
            wachtwoord: wachtwoord.value
        })

    })
    .then(response => response.json())
    .then(data => {

        if (data.succes) {

            alert('Je account is aangemaakt!');

            window.location.href = "index.html";

        } else {

            alert(data.fout || 'Registratie mislukt.');

        }

    })
    .catch(error => console.error('Error:', error));
}