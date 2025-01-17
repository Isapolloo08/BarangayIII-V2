<?php
// Database connection parameters
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Create a new connection to the database
$conn = new mysqli($hostname, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch residents data from the 'residentstb' table
$sql = "SELECT id, first_name, middle_name, last_name, suffix, age, purok, barangay, sex, contact_number, is_household_head, household_head_name, relationship, household_number FROM residentstb";
$result = $conn->query($sql);

// Initialize an array to store the fetched data
$residents = [];

// Check if there are any results
if ($result->num_rows > 0) {
    // Fetch all the rows and store them in the residents array
    while($row = $result->fetch_assoc()) {
        $residents[] = [
            'id' => $row['id'],
            'firstName' => $row['first_name'],
            'middleName' => $row['middle_name'],
            'lastName' => $row['last_name'],
            'suffix' => $row['suffix'],
            'age' => $row['age'],
            'purok' => $row['purok'],
            'barangay' => $row['barangay'],
            'sex' => $row['sex'],
            'contactNumber' => $row['contact_number'],
            'isHouseholdHead' => $row['is_household_head'],
            'householdHeadName' => $row['household_head_name'],
            'relationship' => $row['relationship'],
            'householdNumber' => $row['household_number']
        ];
    }
} else {
    $residents = []; // No data found
}

// Close the database connection
$conn->close();

// Set the content type to JSON
header('Content-Type: application/json');

// Return the data as a JSON response
echo json_encode($residents);

?>
