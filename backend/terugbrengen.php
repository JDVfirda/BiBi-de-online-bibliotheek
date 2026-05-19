<?php
// Een programma waarmee een gebruiker een boek kan terugbrengen (POST) naar de database
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$boek_id = intval($data['boek_id']);
$klant_id = intval($data['klant_id']);


// 1. Zoek actieve uitlening van deze klant
$sql = "
SELECT u.id, u.serienummer_id
FROM uitleningen u
JOIN voorraad v ON v.serienummer_id = u.serienummer_id
WHERE v.boek_id = $boek_id
AND u.klant_id = $klant_id
AND u.datum_terug IS NULL
LIMIT 1
";

$result = $verbinding->query($sql);

if ($result->num_rows === 0) {

    echo json_encode([
        'succes' => false,
        'fout' => 'Geen actieve uitlening gevonden'
    ]);

    exit;
}

$row = $result->fetch_assoc();

$serienummer_id = $row['serienummer_id'];


// 2. Zet uitlening op teruggebracht
$updateLoan = "
UPDATE uitleningen
SET datum_terug = NOW()
WHERE serienummer_id = $serienummer_id
AND datum_terug IS NULL
";

$verbinding->query($updateLoan);


// 3. Zet voorraad weer beschikbaar
$updateStock = "
UPDATE voorraad
SET status = 'beschikbaar'
WHERE serienummer_id = $serienummer_id
";

$verbinding->query($updateStock);


echo json_encode([
    'succes' => true,
    'message' => 'Boek teruggebracht'
]);

$verbinding->close();