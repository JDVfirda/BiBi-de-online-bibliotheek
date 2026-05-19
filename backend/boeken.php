<?php
// Een programma waarmee je boeken kunt ophalen (GET), toevoegen(POST) en verwijderen(DELETE)
// Sta verzoeken toe van de frontend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');


require_once 'config/database.php';
$klant_id = intval($_GET['klant_id'] ?? 0);

$methode = $_SERVER['REQUEST_METHOD'];

switch ($methode) {

  case 'GET':

$sql = "
SELECT 
    b.*,

    COUNT(v.serienummer_id) AS totaal_kopieen,

    CASE 
        WHEN COUNT(v.serienummer_id) > 0
        THEN 1
        ELSE 0
    END AS has_back,

    EXISTS (
        SELECT 1
        FROM uitleningen u
        JOIN voorraad vv 
            ON vv.serienummer_id = u.serienummer_id
        WHERE vv.boek_id = b.id
        AND u.klant_id = $klant_id
        AND u.datum_terug IS NULL
    ) AS geleend_door_gebruiker,

    EXISTS (
        SELECT 1
        FROM reserveringen r
        WHERE r.boek_id = b.id
        AND r.klant_id = $klant_id
        AND r.status = 'actief'
    ) AS gereserveerd_door_gebruiker

FROM boeken b

LEFT JOIN voorraad v 
    ON v.boek_id = b.id

GROUP BY b.id
";

$result = $verbinding->query($sql);

if (!$result) {
    echo json_encode([
        "error" => "SQL error",
        "message" => $verbinding->error
    ]);
    exit;
}

$boeken = [];

while ($row = $result->fetch_assoc()) {
    $boeken[] = $row;
}

echo json_encode($boeken);

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