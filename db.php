<?php

$conn = new mysqli('localhost', 'root', '', 'myfitness_stock');

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
$conn->set_charset("utf8");

?>