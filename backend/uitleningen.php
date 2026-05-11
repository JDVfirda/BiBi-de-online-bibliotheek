<?php
// Een programma waarmee je een uitlening kunt ophalen (GET) uit de database
// toevoegen (POST) en verwijderen (DELETE)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');


require_once 'config/database.php';

$methode = $_SERVER['REQUEST_METHOD'];

switch ($methode) {


    case 'GET':
    


    case 'POST':



    case 'DELETE':



$verbinding->close();