<?php
header('Content-Type: application/json');

// Database credentials
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$residentId = $_GET['id'];

$sql = "SELECT * FROM residentstb WHERE id = ?"; // Replace with your table name and column
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $residentId);
$stmt->execute();
$result = $stmt->get_result();

$resident = $result->fetch_assoc();

echo json_encode($resident);

$conn->close();
?>