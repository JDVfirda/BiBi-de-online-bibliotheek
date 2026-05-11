<?php
// Een programma waarmee je een uitlening kunt ophalen (GET) uit de database
// toevoegen (POST) en verwijderen (DELETE) terugbrengen van een boek

include 'db.php';

header('Content-Type: application/json');

$boek_id = $data['boek_id'];
$klant_id = 2;

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

/* =========================
   LEEN BOEK
   ========================= */
if ($action === "leen") {

    // Check availability
    $check = $conn->prepare("
        SELECT aantal_beschikbaar 
        FROM boeken 
        WHERE id = ?
    ");
    $check->bind_param("i", $boek_id);
    $check->execute();
    $result = $check->get_result()->fetch_assoc();

    if (!$result || $result['aantal_beschikbaar'] <= 0) {
        echo json_encode([
            "success" => false,
            "message" => "Niet beschikbaar"
        ]);
        exit;
    }

    // Insert loan record
    $stmt = $conn->prepare("
        INSERT INTO uitleningen (boek_id, klant_id, datum_uit)
        VALUES (?, ?, NOW())
    ");
    $stmt->bind_param("ii", $boek_id, $klant_id);
    $stmt->execute();

    // Decrease stock
    $update = $conn->prepare("
        UPDATE boeken 
        SET aantal_beschikbaar = aantal_beschikbaar - 1
        WHERE id = ?
    ");
    $update->bind_param("i", $boek_id);
    $update->execute();

    echo json_encode([
        "success" => true,
        "message" => "Boek geleend"
    ]);

    exit;
}

/* =========================
   TERUGGEBRACHT
   ========================= */
if ($action === "terug") {

    // Increase stock
    $update = $conn->prepare("
        UPDATE boeken 
        SET aantal_beschikbaar = aantal_beschikbaar + 1
        WHERE id = ?
    ");
    $update->bind_param("i", $boek_id);
    $update->execute();

    echo json_encode([
        "success" => true,
        "message" => "Boek teruggebracht"
    ]);

    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Ongeldige actie"
]);