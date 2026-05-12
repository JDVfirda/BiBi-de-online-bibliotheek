// Laad de accountgegevens van de ingelogde gebruiker

function laadAccountGegevens() {
    const gebruikersnaam = localStorage.getItem('gebruikersnaam');

    // Als gebruiker niet is ingelogd, stuur terug naar homepagina
    if (!gebruikersnaam) {
        window.location.href = 'index.html';
        return;
    }

    // Haal de klantgegevens op uit de backend
    fetch(`backend/klanten.php?gebruikersnaam=${gebruikersnaam}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('account-voornaam').textContent = data.voornaam;
            document.getElementById('account-achternaam').textContent = data.achternaam;
            document.getElementById('account-gebruikersnaam').textContent = data.gebruikersnaam;
            document.getElementById('account-email').textContent = data.email;
            document.getElementById('account-telefoon').textContent = data.telefoon ?? '-';
            document.getElementById('account-datum').textContent = data.aanmaak_datum;
        })
        .catch(error => console.error('Fout bij laden account:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    laadAccountGegevens();
});