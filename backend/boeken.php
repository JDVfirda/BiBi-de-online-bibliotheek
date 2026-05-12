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
    $taal = $verbinding->real_escape_string($data['taal']);
    $auteur = $verbinding->real_escape_string($data['auteur']);
    $genre = $verbinding->real_escape_string($data['genre']);
    $pagina_aantal = intval($data['pagina_aantal']);
    $publicatiedatum = $verbinding->real_escape_string($data['publicatiedatum']);
    $uitgever = $verbinding->real_escape_string($data['uitgever']);
    $isbn = $verbinding->real_escape_string($data['isbn']);

    $sql = "
        INSERT INTO boeken 
        (
            titel,
            taal,
            auteur,
            genre,
            pagina_aantal,
            publicatiedatum,
            uitgever,
            isbn
        )
        VALUES
        (
            '$titel',
            '$taal',
            '$auteur',
            '$genre',
            $pagina_aantal,
            '$publicatiedatum',
            '$uitgever',
            '$isbn'
        )
    ";

    if ($verbinding->query($sql)) {
        echo json_encode(['succes' => true]);
    } else {
        echo json_encode([
            'succes' => false,
            'fout' => $verbinding->error
        ]);
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