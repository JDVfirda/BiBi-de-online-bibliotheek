<?php
// Een programma waarmee je een klant kunt ophalen (GET) uit de database,
// toevoegen (POST) en verwijderen (DELETE)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');


require_once 'config/database.php';

$methode = $_SERVER['REQUEST_METHOD'];

switch ($methode) {
    
    case 'GET':
        $resultaat = $verbinding->query('SELECT * FROM klanten');
        $klanten = [];

        while ($rij = $resultaat->fetch_assoc()) {
            $klanten[] = $rij;
        }

        echo json_encode($klanten);
        break;


    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $voornaam = $verbinding->real_escape_string($data['voornaam']);
        $achternaam = $verbinding->real_escape_string($data['achternaam']);
        $gebruikersnaam = $verbinding->real_escape_string($data['gebruikersnaam']);
        $email = $verbinding->real_escape_string($data['email']);
        $wachtwoord = password_hash($data['wachtwoord'], PASSWORD_BCRYPT);
        $telefoon = $verbinding->real_escape_string($data['telefoon']);


        $sql = "INSERT INTO klanten (voornaam, achternaam, gebruikersnaam, email, wachtwoord, telefoon)
                VALUES ('$voornaam', '$achternaam', '$gebruikersnaam', '$email', '$wachtwoord', '$telefoon')";

        if ($verbinding->query($sql)) {
            echo json_encode(['succes' => true]);
        } else {
            echo json_encode(['succes' => false, 'fout' => $verbinding->error]);
        }
        break;


    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id']);

        $sql = "DELETE FROM klanten WHERE id = $id";

        if ($verbinding->query($sql)) {
            echo json_encode(['succes' => true]);
        } else {
            echo json_encode(['succes' => false, 'fout' => $verbinding->error]);
        }
        break;
}

$verbinding->close();