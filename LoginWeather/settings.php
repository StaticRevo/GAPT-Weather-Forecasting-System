<?php
session_start();
if(!isset($_SESSION['logged_in'])){
    $_SESSION['logged_in'] = false;
}

//This brings in a twig instance for use by this script
require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/database.php';
require_once 'gen-php/loginlogic.php';

//Load from the DB
$db = new Db();

// Ensure this script only runs for POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize input
    $temperatureUnit = $db->quote(clean_input($_POST['temperature_unit']));
    $distanceUnit = $db->quote(clean_input($_POST['distance_unit']));
    $precipitationUnit = $db->quote(clean_input($_POST['precipitation_unit']));
    $windUnit = $db->quote(clean_input($_POST['wind_unit']));

    $userId = $_SESSION['user_id'];

    // Check if user preferences already exist
    $stmt = $db->prepare('SELECT COUNT(*) FROM preferences WHERE user_id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_array(MYSQLI_NUM);
    $preferencesCount = $row[0];

    if ($preferencesCount > 0) {
        // Update existing preferences
        $stmt = $db->prepare('UPDATE Preferences SET temperature_unit = ?, distance_unit = ?, precipitation_unit = ?, wind_unit = ? WHERE user_id = ?');
        $stmt->bind_param('ssssi', $temperatureUnit, $distanceUnit, $precipitationUnit, $windUnit, $userId);
    } else {
        // Insert new preferences
        $stmt = $db->prepare('INSERT INTO Preferences (user_id, temperature_unit, distance_unit, precipitation_unit, wind_unit) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('issss', $userId, $temperatureUnit, $distanceUnit, $precipitationUnit, $windUnit);
    }
    $stmt->execute();

    header('Location: settings.php'); // Redirect to a confirmation page or back to settings
} 
  

// adds to the title tag
$title = "Settings";
    
// completes the CSS filename
$filename = "settings";

// Render view
echo $twig->render($filename . '.html', [
    'title' => $title, 
    'filename' => $filename, 
    'logged_in' => $_SESSION['logged_in']
]);

