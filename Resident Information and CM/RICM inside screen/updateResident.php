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

// Get the raw POST data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Check if the required data is present
if (isset($data['id'])) {
    // Prepare the SQL query to update the resident information
    $id = $data['id'];
    $firstName = $data['firstName'];
    $middleName = $data['middleName'];
    $lastName = $data['lastName'];
    $suffix = $data['suffix'];
    $contactNumber = $data['contactNumber'];
    $address = $data['address'];
    $householdHeadName = $data['householdHeadName'];
    $relationship = $data['relationship'];
    $dateOfBirth = $data['dateOfBirth'];
    $age = $data['age'];
    $sex = $data['sex'];
    $ethnicity = $data['ethnicity'];
    $civilStatus = $data['civilStatus'];
    $citizenship = $data['citizenship'];
    $occupation = $data['occupation'];
    $educationalAttainment = $data['educationalAttainment'];
    $religion = $data['religion'];
    $psMember = $data['psMember'];
    $philhealthMember = $data['philhealthMember'];
    $medicalHistory = $data['medicalHistory'];
    $typeOfWaterSource = $data['typeOfWaterSource'];
    $typeOfToiletFacility = $data['typeOfToiletFacility'];
    $purok = $data['purok'];
    $barangay = $data['barangay'];

    // SQL query to update the resident's data
    $query = "UPDATE residentstb SET 
                firstName = '$firstName',
                middleName = '$middleName',
                lastName = '$lastName',
                suffix = '$suffix',
                contactNumber = '$contactNumber',
                address = '$address',
                householdHeadName = '$householdHeadName',
                relationship = '$relationship',
                dateOfBirth = '$dateOfBirth',
                age = '$age',
                sex = '$sex',
                ethnicity = '$ethnicity',
                civilStatus = '$civilStatus',
                citizenship = '$citizenship',
                occupation = '$occupation',
                educationalAttainment = '$educationalAttainment',
                religion = '$religion',
                psMember = '$psMember',
                philhealthMember = '$philhealthMember',
                medicalHistory = '$medicalHistory',
                typeOfWaterSource = '$typeOfWaterSource',
                typeOfToiletFacility = '$typeOfToiletFacility',
                purok = '$purok',
                barangay = '$barangay'
              WHERE id = '$id'";

    // Execute the query
    if ($conn->query($query) === TRUE) {
        // Success response
        echo json_encode(["status" => "success", "message" => "Resident updated successfully"]);
    } else {
        // Failure response
        echo json_encode(["status" => "error", "message" => "Failed to update resident"]);
    }
} else {
    // Error if required data is not present
    echo json_encode(["status" => "error", "message" => "Missing resident ID"]);
}

// Close the database connection
$conn->close();
?>
