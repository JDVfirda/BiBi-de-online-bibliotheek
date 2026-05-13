<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$boek_id = intval($data['boek_id']);
$klant_id = intval($data['klant_id']);

// 1. find ANY copy of this book (even if not available)
$sql = "
SELECT serienummer_id
FROM voorraad
WHERE boek_id = $boek_id
LIMIT 1
";

$result = $verbinding->query($sql);

if (!$result || $result->num_rows === 0) {
    echo json_encode([
        'succes' => false,
        'fout' => 'Geen exemplaar gevonden'
    ]);
    exit;
}

$row = $result->fetch_assoc();
$serienummer_id = $row['serienummer_id'];

// 2. insert reservation into SAME table
$insert = "
INSERT INTO uitleningen
(serienummer_id, klant_id, datum_uit, datum_terug, status)
VALUES
($serienummer_id, $klant_id, NULL, NULL, 'gereserveerd')
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