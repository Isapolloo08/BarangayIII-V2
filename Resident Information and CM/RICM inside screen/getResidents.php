<?php
// Set the header to indicate the response is JSON
header('Content-Type: application/json');

// Database connection credentials
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Create the database connection
$conn = new mysqli($hostname, $username, $password, $database);

// Check if connection is successful
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// SQL query to get all residents data
$query = "SELECT * FROM residentstb";
$result = $conn->query($query);

$residents = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $residents[] = $row;
    }
    // Return the residents data in JSON format
    echo json_encode(["status" => "success", "data" => $residents]);
} else {
    // If no data found
    echo json_encode(["status" => "error", "message" => "No residents found"]);
}

// Close the database connection
$conn->close();
?>
