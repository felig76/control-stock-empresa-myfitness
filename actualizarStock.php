<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

error_log("Inicio de actualizarStock.php");

$conn = new mysqli("localhost", "root", "", "myfitness_stock");

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

foreach ($data as $producto) {
    $nombre = $producto['nombre_producto'];
    $cantidad = $producto['cantidad_producto'];
    // Actualizar el stock en la base de datos
    $sql = "UPDATE stock SET cantidad_producto = cantidad_producto - $cantidad WHERE nombre_producto = '$nombre'";
    if ($conn->query($sql) !== TRUE) {
        echo "Error actualizando el stock: " . $conn->error;
    }
}

$conn->close();
?>