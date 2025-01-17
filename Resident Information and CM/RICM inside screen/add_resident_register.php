<?php
// Include the database connection
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Create connection
$conn = new mysqli($hostname, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection Failed: " . $conn->connect_error)));
}
// Set the response header to JSON
header('Content-Type: application/json');

// Get the JSON request body
$requestBody = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$requiredFields = [
    'isHouseholdHead', 'householdNumber', 'householdHeadName', 'relationship', 
    'lastName', 'firstName', 'middleName', 'suffix', 'contactNumber', 'region', 
    'province', 'municipality', 'barangay', 'dateOfBirth', 'birthPlace', 'age', 
    'sex', 'civilStatus', 'citizenship', 'occupation', 'educationalAttainment', 
    'religion', 'ethnicity', 'psMember', 'philhealthMember', 'philhealthIdNumber'
];

$missingFields = array_filter($requiredFields, function ($field) use ($requestBody) {
    return !isset($requestBody[$field]) || empty($requestBody[$field]);
});

if (!empty($missingFields)) {
    echo json_encode(['error' => 'Missing required fields: ' . implode(', ', $missingFields)]);
    exit;
}

// Extract fields from the request
$isHouseholdHead = $requestBody['isHouseholdHead'];
$householdNumber = $requestBody['householdNumber'];
$householdHeadName = $requestBody['householdHeadName'];
$relationship = $requestBody['relationship'];
$lastName = $requestBody['lastName'];
$firstName = $requestBody['firstName'];
$middleName = $requestBody['middleName'];
$suffix = $requestBody['suffix'];
$contactNumber = $requestBody['contactNumber'];
$region = $requestBody['region'];
$province = $requestBody['province'];
$municipality = $requestBody['municipality'];
$barangay = $requestBody['barangay'];
$dateOfBirth = $requestBody['dateOfBirth'];
$birthPlace = $requestBody['birthPlace'];
$age = $requestBody['age'];
$sex = $requestBody['sex'];
$civilStatus = $requestBody['civilStatus'];
$citizenship = $requestBody['citizenship'];
$occupation = $requestBody['occupation'];
$educationalAttainment = $requestBody['educationalAttainment'];
$religion = $requestBody['religion'];
$ethnicity = $requestBody['ethnicity'];
$psMember = $requestBody['psMember'];
$philhealthMember = $requestBody['philhealthMember'];
$philhealthIdNumber = $requestBody['philhealthIdNumber'];

// Prepare and execute the SQL insert query
$stmt = $conn->prepare("
    INSERT INTO resident_register (
        is_household_head, household_number, household_head_name, relationship, 
        last_name, first_name, middle_name, suffix, contact_number, region, 
        province, municipality, barangay, date_of_birth, birth_place, age, 
        sex, civil_status, citizenship, occupation, educational_attainment, 
        religion, ethnicity, ps_member, philhealth_member, philhealth_id_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssssssssssssissssssssss",
    $isHouseholdHead, $householdNumber, $householdHeadName, $relationship, 
    $lastName, $firstName, $middleName, $suffix, $contactNumber, $region, 
    $province, $municipality, $barangay, $dateOfBirth, $birthPlace, $age, 
    $sex, $civilStatus, $citizenship, $occupation, $educationalAttainment, 
    $religion, $ethnicity, $psMember, $philhealthMember, $philhealthIdNumber
);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Resident registered successfully']);
} else {
    echo json_encode(['error' => 'Failed to register resident: ' . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
mysqli_close($conn);
?>
