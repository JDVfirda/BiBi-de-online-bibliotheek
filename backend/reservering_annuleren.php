<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id']);

// 1. annuleer reservering
$sql = "
UPDATE reserveringen
SET status = 'geannuleerd'
WHERE id = $id
AND status = 'actief'
";

$verbinding->query($sql);

// 2. reactie
echo json_encode([
    'succes' => true,
    'message' => 'Reservering geannuleerd'
]);

$verbinding->close();