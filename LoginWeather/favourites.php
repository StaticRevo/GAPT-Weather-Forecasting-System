<?php
require_once __DIR__.'/bootstrap.php';
require_once 'gen-php/loginlogic.php';
require_once __DIR__.'/database.php';

// Create an instance of the Db class
$db = new Db();

// Get the user ID from the session
$user_id = $_SESSION['user_id'];

// Get the latitude and longitude from the POST data
$data = json_decode(file_get_contents('php://input'), true);
$latitude = $data['latitude'];
$longitude = $data['longitude'];

try {
    // Prepare INSERT statement using the Db class
    $stmt = $db->prepare("INSERT INTO favourites (user_id, latitude, longitude) VALUES (?, ?, ?)");

    // Bind parameters
    $stmt->bind_param("idd", $user_id, $latitude, $longitude);

    // Execute the statement
    $stmt->execute();

    // Check if a row was inserted
    if ($stmt->affected_rows > 0) {
        // Send success response
        echo "Location saved to favorites successfully";
    } else {
        // Send failure response
        echo "Failed to save location to favorites";
    }
} catch (Exception $e) {
    // Handle errors
    http_response_code(500); // Internal Server Error
    exit("Error: " . $e->getMessage());
}
?>
