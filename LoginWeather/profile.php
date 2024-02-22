<?php

require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/database.php';
require_once 'gen-php/loginlogic.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


//Get db object
$db = new Db();   

//Get the user ID from the session
$user_id = $_SESSION['user_id'];

//Fetch user data from the DB
$stmt = $db->prepare('SELECT Name, Surname, Email, user_id FROM Users WHERE user_id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $newName = $_POST['new-name'];
    $newSurname = $_POST['new-surname'];
    $newEmail = $_POST['new-email'];
    $newPassword = $_POST['new-password'];

    // Check if any of the update fields are not empty
    if (!empty($newName) || !empty($newSurname) || !empty($newEmail) || !empty($newPassword)) {
        // Update user information in the database
        $stmt = $db->prepare('UPDATE Users SET Name=?, Surname=?, Email=?, Password=? WHERE user_id = ?');
        $stmt->bind_param('ssssi', $newName, $newSurname, $newEmail, $newPassword, $_SESSION['user_id']);
        $stmt->execute();
    }
    
    // Handle file upload for profile picture
    if (isset($_FILES['profile-picture']) && $_FILES['profile-picture']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        $uploadFile = $uploadDir . basename($_FILES['profile-picture']['name']);
        
        // Move uploaded file to permanent location
        if (move_uploaded_file($_FILES['profile-picture']['tmp_name'], $uploadFile)) {
            // Insert file path into ExtraUsers table
            $stmt = $db->prepare('UPDATE ExtraUsers SET profile_picture = ? WHERE user_id = ?');
            $stmt->bind_param('si', $uploadFile, $_SESSION['user_id']);
            $stmt->execute();
        }
    }

    // Insert bio into ExtraUsers table
    if (!empty($_POST['bio'])) {
        $bio = $_POST['bio'];
        $stmt = $db->prepare('UPDATE ExtraUsers SET bio = ? WHERE user_id = ?');
        $stmt->bind_param('si', $bio, $_SESSION['user_id']);
        $stmt->execute();
    }
}

// adds to the title tag
$title = "Profile";
    
// completes the CSS filename
$filename = "profile";

// Render view
echo $twig->render($filename . '.html', ['title' => $title, 'filename' => $filename, 'user' => $user, 'logged_in' => $_SESSION['logged_in']]);
