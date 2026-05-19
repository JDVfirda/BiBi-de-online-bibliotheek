<?php
// Een programma waarmee een gebruiker kan uitloggen
session_start();
session_destroy();
echo json_encode(['succes' => true]);