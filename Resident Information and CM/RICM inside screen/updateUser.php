<?php
// Database connection settings
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Create a connection to the database
$conn = new mysqli($hostname, $username, $password, $database);

// Check if connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the data from the incoming POST request
$data = json_decode(file_get_contents("php://input"), true);

// Extract the form data from the JSON payload
$residentId = $data['id'] ?? ''; // The unique ID of the resident
$contactNumber = $data['contactNumber'] ?? '';
$address = $data['address'] ?? '';
$civilStatus = $data['civilStatus'] ?? '';
$occupation = $data['occupation'] ?? '';
$educationalAttainment = $data['educationalAttainment'] ?? '';
$religion = $data['religion'] ?? '';
$ethnicity = $data['ethnicity'] ?? '';
$psMember = $data['psMember'] ?? '';
$psHouseholdId = $data['psHouseholdId'] ?? '';
$philhealthMember = $data['philhealthMember'] ?? '';
$philhealthIdNumber = $data['philhealthIdNumber'] ?? '';
$membershipType = $data['membershipType'] ?? '';
$philhealthCategory = $data['philhealthCategory'] ?? '';
$medicalHistory = $data['medicalHistory'] ?? '';
$lmp = $data['lmp'] ?? '';
$usingFpMethod = $data['usingFpMethod'] ?? '';
$familyPlanningMethodUsed = $data['familyPlanningMethodUsed'] ?? '';
$familyPlanningStatus = $data['familyPlanningStatus'] ?? '';
$typeOfWaterSource = $data['typeOfWaterSource'] ?? '';
$typeOfToiletFacility = $data['typeOfToiletFacility'] ?? '';
$householdMembers = json_encode($data['householdMembers'] ?? []); // Convert household members to JSON format

// SQL query to update data in the residents table
$sql = "UPDATE residents SET 
    contactNumber = ?, address = ?, civilStatus = ?, occupation = ?, educationalAttainment = ?, religion = ?, 
    ethnicity = ?, psMember = ?, psHouseholdId = ?, philhealthMember = ?, philhealthIdNumber = ?, 
    membershipType = ?, philhealthCategory = ?, medicalHistory = ?, lmp = ?, usingFpMethod = ?, 
    familyPlanningMethodUsed = ?, familyPlanningStatus = ?, typeOfWaterSource = ?, typeOfToiletFacility = ?, 
    householdMembers = ? 
    WHERE id = ?";

// Prepare and bind the SQL statement
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssssssssssssssssssssi", 
    $contactNumber, $address, $civilStatus, $occupation, $educationalAttainment, $religion, 
    $ethnicity, $psMember, $psHouseholdId, $philhealthMember, $philhealthIdNumber, $membershipType, 
    $philhealthCategory, $medicalHistory, $lmp, $usingFpMethod, $familyPlanningMethodUsed, 
    $familyPlanningStatus, $typeOfWaterSource, $typeOfToiletFacility, $householdMembers, $residentId
);

// Execute the query
if ($stmt->execute()) {
    // Send a response back to the frontend
    echo json_encode(['success' => true, 'message' => 'Data updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update data: ' . $stmt->error]);
}

// Close the connection
$stmt->close();
$conn->close();
?>
