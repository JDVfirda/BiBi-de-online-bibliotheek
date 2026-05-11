<?php
// Een programma waarmee een gebruiker kan inloggen met gebruikersnaam of email en wachtwoord

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$login = $verbinding->real_escape_string($data['login']);
$wachtwoord = $data['wachtwoord'];

$sql = "SELECT * FROM klanten WHERE gebruikersnaam = '$login' OR email = '$login'";
$resultaat = $verbinding->query($sql);

if ($resultaat->num_rows === 0) {
    echo json_encode(['succes' => false, 'fout' => 'Gebruikersnaam of email niet gevonden']);
} else {
    $klant = $resultaat->fetch_assoc();

    if (password_verify($wachtwoord, $klant['wachtwoord'])) {
        echo json_encode([
            'succes' => true,
            'klant' => [
                'id' => $klant['id'],
                'voornaam' => $klant['voornaam'],
                'achternaam' => $klant['achternaam'],
                'gebruikersnaam' => $klant['gebruikersnaam'],
                'email' => $klant['email']
            ]
        ]);
    } else {
        echo json_encode(['succes' => false, 'fout' => 'Wachtwoord is onjuist']);
    }
}

$verbinding->close();