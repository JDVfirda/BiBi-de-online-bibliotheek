<?php
// Een programma waarmee een gebruiker zijn geleende en gereserveerde boeken kan zien (GET) uit de database
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config/database.php';

$klant_id = intval($_GET['klant_id'] ?? 0);

if ($klant_id === 0) {
    echo json_encode([]);
    exit;
}

$books = [];

/*
  GELEENDE BOEKEN
*/
$sql1 = "
SELECT 
    b.id,
    b.titel,
    b.auteur,
    'geleend' AS status
FROM uitleningen u
JOIN voorraad v ON v.serienummer_id = u.serienummer_id
JOIN boeken b ON b.id = v.boek_id
WHERE u.klant_id = $klant_id
AND u.datum_terug IS NULL
";

$result1 = $verbinding->query($sql1);

if (!$result1) {
    echo json_encode(["error" => $verbinding->error]);
    exit;
}

while ($row = $result1->fetch_assoc()) {
    $books[] = $row;
}

/*
  RESERVERINGEN
*/
$sql2 = "
SELECT 
    b.id,
    b.titel,
    b.auteur,
    'gereserveerd' AS status
FROM reserveringen r
JOIN boeken b ON b.id = r.boek_id
WHERE r.klant_id = $klant_id
AND r.status = 'actief'
";

$result2 = $verbinding->query($sql2);

if (!$result2) {
    echo json_encode(["error" => $verbinding->error]);
    exit;
}

while ($row = $result2->fetch_assoc()) {
    $books[] = $row;
}

echo json_encode($books);

$verbinding->close();