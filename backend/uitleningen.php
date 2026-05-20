<?php
// Een programma waarmee je een uitlening kunt ophalen (GET) uit de database
// toevoegen (POST) en verwijderen (DELETE)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$methode = $_SERVER['REQUEST_METHOD'];

switch ($methode) {

    case 'GET':
        $sql = "
        SELECT 
            u.id,
            b.titel,
            k.voornaam,
            k.achternaam,
            u.datum_uit,
            u.datum_terug,
            u.status
        FROM uitleningen u
        JOIN voorraad v ON u.serienummer_id = v.serienummer_id
        JOIN boeken b ON v.boek_id = b.id
        JOIN klanten k ON u.klant_id = k.id
    ";
        $resultaat = $verbinding->query($sql);
        $uitleningen = [];
        while ($rij = $resultaat->fetch_assoc()) {
            $uitleningen[] = $rij;
        }
        echo json_encode($uitleningen);
        break;

    case 'POST':

        $data = json_decode(file_get_contents('php://input'), true);

        $boek_id = intval($data['boek_id']);
        $klant_id = intval($data['klant_id']);

        // 1. vind beschikbaar exemplaar van dit boek
        $sql = "
        SELECT serienummer_id
        FROM voorraad
        WHERE boek_id = $boek_id
        AND status = 'beschikbaar'
        LIMIT 1
        ";

        $resultaat = $verbinding->query($sql);

        if ($resultaat->num_rows === 0) {
            echo json_encode([
                'succes' => false,
                'fout' => 'Geen beschikbare exemplaren'
            ]);
            break;
        }

        $voorraad = $resultaat->fetch_assoc();
        $serienummer_id = $voorraad['serienummer_id'];

        // 2. check of klant al een exemplaar van dit boek heeft geleend
        $check = "
        SELECT *
        FROM uitleningen
        WHERE klant_id = $klant_id
        AND datum_terug IS NULL
        AND serienummer_id IN (
        SELECT serienummer_id
        FROM voorraad
        WHERE boek_id = $boek_id)
        ";

        $res = $verbinding->query($check);

        if ($res->num_rows > 0) {
            echo json_encode([
                'succes' => false,
                'fout' => 'Je hebt dit boek al geleend'
            ]);
            break;
        }

        // 3. maak de uitlening aan
        $insert_sql = "
        INSERT INTO uitleningen (serienummer_id, klant_id, datum_uit)
        VALUES ($serienummer_id, $klant_id, NOW())
     ";

        $verbinding->query($insert_sql);


        // 4. update voorraad status
        $update_sql = "
        UPDATE voorraad
        SET status = 'uitgeleend'
        WHERE serienummer_id = $serienummer_id
        ";

        $verbinding->query($update_sql);


        echo json_encode([
            'succes' => true
        ]);

        break;

    case 'DELETE':
        break;
}

$verbinding->close();
