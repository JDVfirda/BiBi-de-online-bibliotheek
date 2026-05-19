<?php
// Een programma waarmee een gebruiker een boek kan reserveren (POST) naar de database
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$boek_id = intval($data['boek_id']);
$klant_id = intval($data['klant_id']);

// 1. controleer of klant dit boek al gereserveerd heeft
$check = "
SELECT *
FROM reserveringen
WHERE boek_id = $boek_id
AND klant_id = $klant_id
AND status = 'actief'
";

$res = $verbinding->query($check);

if ($res->num_rows > 0) {
    echo json_encode([
        'succes' => false,
        'fout' => 'Je hebt dit boek al gereserveerd'
    ]);
    exit;
}

// 2. maak reservering aan
$insert = "
INSERT INTO reserveringen
(boek_id, klant_id, status)
VALUES
($boek_id, $klant_id, 'actief')
";

if ($verbinding->query($insert)) {
    echo json_encode([
        'succes' => true,
        'message' => 'Boek gereserveerd'
    ]);
} else {
    echo json_encode([
        'succes' => false,
        'fout' => $verbinding->error
    ]);
}

$verbinding->close();