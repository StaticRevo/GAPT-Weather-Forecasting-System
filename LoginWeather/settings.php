<?php
session_start();
if(!isset($_SESSION['logged_in'])){
    $_SESSION['logged_in'] = false;
}

//This brings in a twig instance for use by this script
require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/database.php';
require_once 'gen-php/loginlogic.php';
require_once 'gen-php/validate.php';

//Load from the DB
$db = new Db();

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    $_SESSION['alert_message'] = 'You must be logged in to access the settings page!. Register Now to store favourite places and also save your preferences!';
    // Redirect user to login page or show an error
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id']; // Get the user's ID from session

//Handle form submission
$error_message = '';
$success_message = '';

// Handle the form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $temperature_unit = $_POST['temperature_unit'];
    $distance_unit = $_POST['distance_unit'];
    $precipitation_unit = $_POST['precipitation_unit'];
    $wind_unit = $_POST['wind_unit'];

    //there is no need of validation as the user is not entering any input himself
     // Check if a preferences record already exists for the user
     $stmt = $db->prepare('SELECT COUNT(*) FROM Preferences WHERE user_id = ?');
     $stmt->bind_param('i', $user_id); // 'i' denotes the parameter type is an integer
     $stmt->execute();
     $result = $stmt->get_result();
     $row = $result->fetch_array(MYSQLI_NUM);
     $exists = $row[0] > 0;
 
     if ($exists) {
         // Update existing record
         $updateStmt = $db->prepare('UPDATE Preferences SET temperature_unit = ?, distance_unit = ?, precipitation_unit = ?, wind_unit = ? WHERE user_id = ?');
         $updateStmt->bind_param('ssssi', $temperature_unit, $distance_unit, $precipitation_unit, $wind_unit, $user_id);
         if ($updateStmt->execute()) {
            $success_message = "Your preferences have been updated successfully.";
         }else {
            $error_message = "Failed to update preferences.";
         }
     }else {
         // Insert new record
         $insertStmt = $db->prepare('INSERT INTO Preferences (user_id, temperature_unit, distance_unit, precipitation_unit, wind_unit) VALUES (?, ?, ?, ?, ?)');
         $insertStmt->bind_param('issss', $user_id, $temperature_unit, $distance_unit, $precipitation_unit, $wind_unit);
         if ($insertStmt->execute()) {
            $success_message = "Your preferences have been saved successfully.";
        } else {
            $error_message = "Failed to save preferences.";
        }
     }
}

// Retrieve the user's preferences
$stmt = $db->prepare('SELECT temperature_unit, distance_unit, precipitation_unit, wind_unit FROM Preferences WHERE user_id = ?');
$stmt->bind_param('i', $user_id); // 'i' denotes the parameter type is an integer
$stmt->execute();
$result = $stmt->get_result();
$preferences = $result->fetch_assoc();

// Add temperature_unit to the session
$_SESSION['temperature_unit'] = $preferences['temperature_unit'];

// adds to the title tag
$title = "Settings";
    
// completes the CSS filename
$filename = "settings";

// Render view
echo $twig->render($filename . '.html', [
    'title' => $title, 
    'filename' => $filename, 
    'logged_in' => $_SESSION['logged_in'],
    'success_message' => $success_message, 
    'error_message' => $error_message, 
    'preferences' => $preferences,
]);
