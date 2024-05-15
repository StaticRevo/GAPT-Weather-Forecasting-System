<?php
require_once __DIR__.'/bootstrap.php';
require_once 'gen-php/loginlogic.php';
require_once __DIR__.'/database.php';

// Check if 'user_id' key exists in the session
if (isset($_SESSION['user_id'])) {
    // Get the user ID from the session
    $user_id = $_SESSION['user_id'];

    // Get db object
    $db = new Db();

    // Prepare and execute the SQL query
    $stmt = $db->prepare("SELECT latitude, longitude, location FROM favourites WHERE user_id = ?");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch the latitude and longitude into separate arrays
    $latitude = [];
    $longitude = [];
    $location = [];
    while ($row = $result->fetch_assoc()) {
        $latitude[] = $row['latitude'];
        $longitude[] = $row['longitude'];
        $location[] = $row['location'];
    }

    // Render the favourites page
    $title = "Favourites";
    $filename = "favourites";
    echo $twig->render($filename . '.html', ['title' => $title, 'filename' => $filename, 'logged_in' => $_SESSION['logged_in'], 'latitude' => $latitude, 'longitude' => $longitude, 'location' => $location]);
    exit();
} else {
    // User not logged in
    echo 'Please log in to view your favourite weather locations.';
}
?>
