<?php
// Een programma waarmee je boeken kunt ophalen (GET), toevoegen(POST) en verwijderen(DELETE)
// Sta verzoeken toe van de frontend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');


require_once 'config/database.php';

$methode = $_SERVER['REQUEST_METHOD'];

switch ($methode) {

    case 'GET':
        $resultaat = $verbinding->query('SELECT * FROM boeken');
        $boeken = [];

        while ($rij = $resultaat->fetch_assoc()) {
            $boeken[] = $rij;
        }

        echo json_encode($boeken);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $titel = $verbinding->real_escape_string($data['titel']);
        $auteur = $verbinding->real_escape_string($data['auteur']);
        $uitgever = $verbinding->real_escape_string($data['uitgever']);
        $jaar = intval($data['jaar']);
        $isbn = $verbinding->real_escape_string($data['isbn']);
        $genre = $verbinding->real_escape_string($data['genre']);
        $kast = $verbinding->real_escape_string($data['kast_nummer']);

        $sql = "INSERT INTO boeken (titel, auteur, uitgever, jaar, isbn, genre, kast_nummer)
                VALUES ('$titel', '$auteur', '$uitgever', $jaar, '$isbn', '$genre', '$kast')";

        if ($verbinding->query($sql)) {
            echo json_encode(['succes' => true]);
        } else {
            echo json_encode(['succes' => false, 'fout' => $verbinding->error]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id']);

        $sql = "DELETE FROM boeken WHERE id = $id";

        if ($verbinding->query($sql)) {
            echo json_encode(['succes' => true]);
        } else {
            echo json_encode(['succes' => false, 'fout' => $verbinding->error]);
        }
        break;
}

$verbinding->close();