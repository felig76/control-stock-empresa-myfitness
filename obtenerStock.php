<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
error_log("Inicio de obtenerStock.php");

require 'db.php';

$sql = "CALL ObtenerStock()";
$result = $conn->query($sql);

$stock = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $stock[] = $row;
    }
} else {
    die(json_encode(array('error' => 'Error en la consulta: ' . $conn->error)));
}

echo json_encode($stock);

$conn->close();
?>