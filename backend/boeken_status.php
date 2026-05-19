<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config/database.php';

$sql = "
SELECT 
    b.id,

    COUNT(DISTINCT v.serienummer_id) AS totaal,

    COUNT(DISTINCT CASE
        WHEN u.datum_terug IS NULL
        THEN u.serienummer_id
    END) AS uitgeleend,

    (
        COUNT(DISTINCT v.serienummer_id)
        -
        COUNT(DISTINCT CASE
            WHEN u.datum_terug IS NULL
            THEN u.serienummer_id
        END)
    ) AS beschikbaar

FROM boeken b

LEFT JOIN voorraad v
    ON v.boek_id = b.id
    AND v.status != 'vermist'
    AND v.status != 'afgeschreven'

LEFT JOIN uitleningen u
    ON u.serienummer_id = v.serienummer_id

GROUP BY b.id
";

$result = $verbinding->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$verbinding->close();
?>