<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$boek_id = intval($data['boek_id'] ?? 0);
$klant_id = intval($data['klant_id'] ?? 0);

$sql = "
DELETE FROM reserveringen
WHERE boek_id = $boek_id
AND klant_id = $klant_id
AND status = 'actief'
";

if ($verbinding->query($sql)) {

    echo json_encode([
        'succes' => true
    ]);

} else {

    echo json_encode([
        'succes' => false,
        'fout' => $verbinding->error
    ]);
}

$verbinding->close();
?>