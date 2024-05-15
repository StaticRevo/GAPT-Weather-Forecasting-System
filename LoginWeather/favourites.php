<?php
require_once __DIR__.'/bootstrap.php';
require_once 'gen-php/loginlogic.php';
require_once __DIR__.'/database.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    // User is not logged in
    $response = array('success' => false, 'message' => 'Please login or register to save your favourite locations!');
    echo json_encode($response);
    exit(); // Stop script execution
}

// Create an instance of the Db class
$db = new Db();

// Get the user ID from the session
$user_id = $_SESSION['user_id'];

// Get the latitude and longitude from the POST data
$data = json_decode(file_get_contents('php://input'), true);
$latitude = (float) $data['latitude']; // Cast latitude to float
$longitude = (float) $data['longitude']; // Cast longitude to float
$location = $data['location'];


    // Check if the location already exists for the user
    $stmt = $db->prepare("SELECT COUNT(*) FROM favourites WHERE user_id = ? AND latitude = ? AND longitude = ?");
    $stmt->bind_param("idd", $user_id, $latitude, $longitude);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ($count > 0) {
        // Location already exists, send a message
        $response = array('success' => false, 'message' => 'Location already exists in favorites');
        echo json_encode($response);
        exit();
    }
    
    // Prepare INSERT statement using the Db class
    $stmt = $db->prepare("INSERT INTO favourites (user_id, latitude, longitude, location) VALUES (?, ?, ?, ?)");

    // Bind parameters
    $stmt->bind_param("idds", $user_id, $latitude, $longitude, $location);

    // Execute the statement
    $stmt->execute();

    // Check if a row was inserted
    if ($stmt->affected_rows > 0) {
        // Send success response
        $response = array('success' => true, 'message' => 'Location saved to favorites successfully');
        echo json_encode($response);
        exit();
    } else {
        // Send failure response
        $response = array('success' => false, 'message' => 'Failed to save location to favorites');
        echo json_encode($response);
        exit();
    }

?>
