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

    COALESCE(SUM(CASE WHEN v.status = 'beschikbaar' THEN 1 ELSE 0 END), 0) AS beschikbare_kopieen,

    CASE 
        WHEN COUNT(v.serienummer_id) > 0 
        AND SUM(CASE WHEN v.status = 'beschikbaar' THEN 1 ELSE 0 END) > 0
        THEN 1 
        ELSE 0 
    END AS has_back

FROM boeken b
LEFT JOIN voorraad v ON v.boek_id = b.id
GROUP BY b.id
";

$result = $verbinding->query($sql);

        if (!$result) {
            echo json_encode(['succes' => false, 'fout' => $verbinding->error]);
            exit;
        }

        $boeken = [];
        while ($row = $result->fetch_assoc()) {
            $boeken[] = $row;
        }

echo json_encode($boeken);
break;

    // Boek toevoegen
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $titel = $verbinding->real_escape_string($data['titel']);
        $auteur = $verbinding->real_escape_string($data['auteur']);
        $uitgever = $verbinding->real_escape_string($data['uitgever']);
        $taal = $verbinding->real_escape_string($data['taal']);
        $pagina_aantal = intval($data['pagina_aantal']);
        $genre = $verbinding->real_escape_string($data['genre']);
        $isbn = $verbinding->real_escape_string($data['isbn']);
        $publicatiedatum = $verbinding->real_escape_string($data['publicatiedatum']);

        $sql = "INSERT INTO boeken (titel, auteur, uitgever, taal, pagina_aantal, genre, isbn, publicatiedatum)
                VALUES ('$titel', '$auteur', '$uitgever', '$taal', $pagina_aantal, '$genre', '$isbn', '$publicatiedatum')";

        if ($verbinding->query($sql)) {
            echo json_encode(['succes' => true]);
        } else {
            echo json_encode(['succes' => false, 'fout' => $verbinding->error]);
        }
        break;

    // Boek verwijderen
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