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

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    $residentID = $data->id;

    // Prepare the SQL query to delete the resident by ID
    $sql = "DELETE FROM residentstb WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $residentID);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to delete resident"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No ID provided"]);
}

$conn->close();
?>
