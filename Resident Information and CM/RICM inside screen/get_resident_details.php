<?php
header('Content-Type: application/json');

// Database credentials
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Create connection
$conn = new mysqli($hostname, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$residentID = $_GET['residentID'];

// Prepare the SQL query to fetch the resident details
$sql = "SELECT * FROM residentstb WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $residentID);
$stmt->execute();
$result = $stmt->get_result();

// Check if any resident was found
if ($result->num_rows > 0) {
    $resident = $result->fetch_assoc();
    echo json_encode(["resident" => $resident]);
} else {
    echo json_encode(["error" => "Resident not found"]);
}

$stmt->close();
$conn->close();
?>
