<?php
// Een programma dat verbinding maakt met de database
$host = "localhost";
$gebruiker = "root";
$wachtwoord = "";
$database = "bibliotheeknieuw";

try {
    $verbinding = new mysqli(hostname: $host, 
                            username: $gebruiker, 
                            password: $wachtwoord, 
                            database: $database);
    $verbinding->set_charset("utf8");

} catch (Exception $e) {
    die(json_encode([
        "succes" => false,
        "fout" => "Verbinding met database is mislukt: " . $e->getMessage()
    ]));
}