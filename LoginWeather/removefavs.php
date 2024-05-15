<?php
require_once __DIR__.'/bootstrap.php';
require_once 'gen-php/loginlogic.php';
require_once __DIR__.'/database.php';

// Get the user ID from the session
$user_id = $_SESSION['user_id'];

// Check if latitude and longitude are provided in the query string
if (isset($_GET['latitude']) && isset($_GET['longitude'])) {
    $latitude = $_GET['latitude'];
    $longitude = $_GET['longitude'];

    if ($user_id !== null) {
        // Get db object
        $db = new Db();

        // Prepare and execute the SQL statement to remove the favorite location
        $stmt = $db->prepare('DELETE FROM favourites WHERE user_id = ? AND latitude = ? AND longitude = ?');
        $stmt->bind_param('idd', $user_id, $latitude, $longitude);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // Set success response
            $response = array('success' => true, 'message' => 'Location removed from favorites successfully.');
            echo json_encode($response);
            exit();
        } else {
            // Set failure response
            $response = array('success' => false, 'message' => 'Failed to remove location from favorites.');
            echo json_encode($response);
            exit();
        }
    } else {
        // User not logged in
        // user should never get to this point but if it somehow happens...
        $response = array('success' => false, 'message' => 'Please login to remove favourite locations.');
        echo json_encode($response);
        exit();
    }
} else {
    // Latitude and/or longitude not provided - internal error
    $response = array('success' => false, 'message' => 'An error has occurred. Please try again!.');
    echo json_encode($response);
    exit();
}

?>
