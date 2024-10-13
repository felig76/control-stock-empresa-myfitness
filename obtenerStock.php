<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "myfitness_stock");

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT nombre_producto, cantidad_producto FROM stock";
$result = $conn->query($sql);

$stock = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stock[] = $row;
    }
}

echo json_encode($stock);

$conn->close();
?>