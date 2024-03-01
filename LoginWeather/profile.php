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
$stmt = $db->prepare('SELECT Users.Name, Users.Surname, Users.Email, Users.user_id, ExtraUsers.bio, ExtraUsers.image_path FROM Users LEFT JOIN ExtraUsers ON Users.user_id = ExtraUsers.user_id WHERE Users.user_id = ?');
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
                // Build the update query dynamically
                $updateQuery = 'UPDATE Users SET';
                $params = [];
                $types = '';
        
                if (!empty($newName)) {
                    $updateQuery .= ' Name=?,';
                    $params[] = $newName;
                    $types .= 's';
                }
        
                if (!empty($newSurname)) {
                    $updateQuery .= ' Surname=?,';
                    $params[] = $newSurname;
                    $types .= 's';
                }
        
                if (!empty($newEmail)) {
                    $updateQuery .= ' Email=?,';
                    $params[] = $newEmail;
                    $types .= 's';
                }
        
                if (!empty($newPassword)) {
                    $updateQuery .= ' Password=?,';
                    $params[] = $newPassword;
                    $types .= 's';
                }
        
                // Remove trailing comma
                $updateQuery = rtrim($updateQuery, ',');
                
                // Add WHERE clause
                $updateQuery .= ' WHERE user_id = ?';
                $types .= 'i';
                $params[] = $_SESSION['user_id'];
        
                // Prepare and execute the update query
                $stmt = $db->prepare($updateQuery);
                $stmt->bind_param($types, ...$params);
                $stmt->execute();
            }
        
    

  // Handle file upload for profile picture
    if (isset($_FILES['profile-picture']) && $_FILES['profile-picture']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '/Applications/XAMPP/xamppfiles/htdocs/LoginWeather2/uploads/'; // Ensure this path is correct and accessible
        $fileExtension = pathinfo($_FILES['profile-picture']['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . '.' . $fileExtension;
        $uploadFile = $uploadDir . $fileName;

        // Move uploaded file to permanent location
        if (move_uploaded_file($_FILES['profile-picture']['tmp_name'], $uploadFile)) {
            // Update database with new file path
            $stmt = $db->prepare('UPDATE ExtraUsers SET image_path = ? WHERE user_id = ?');
            $relativeFilePath = 'uploads/' . $fileName; // Store a relative path that's usable in your application
            $stmt->bind_param('si', $relativeFilePath, $_SESSION['user_id']);
            $stmt->execute();
            echo 'File is uploaded successfully.';
        } else {
            echo 'Failed to move uploaded file.';
        }
    }



     // Insert or update bio in ExtraUsers table
     if (!empty($_POST['bio'])) {
        $bio = $_POST['bio'];
        // Check if a record exists for the user in the ExtraUsers table
        $stmt = $db->prepare('SELECT COUNT(*) AS count FROM ExtraUsers WHERE user_id = ?');
        $stmt->bind_param('i', $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $count = $row['count'];

        if ($count > 0) {
            // If a record exists, update the bio
            $stmt = $db->prepare('UPDATE ExtraUsers SET bio = ? WHERE user_id = ?');
            $stmt->bind_param('si', $bio, $_SESSION['user_id']);
            $stmt->execute();
        } else {
            // If a record doesn't exist, insert a new record
            $stmt = $db->prepare('INSERT INTO ExtraUsers (bio, user_id) VALUES (?, ?)');
            $stmt->bind_param('si', $bio, $_SESSION['user_id']);
            $stmt->execute();
        }
     }

}
// adds to the title tag
$title = "Profile";
    
// completes the CSS filename
$filename = "profile";

// Render view
echo $twig->render($filename . '.html', ['title' => $title, 'filename' => $filename, 'user' => $user, 'logged_in' => $_SESSION['logged_in']]);
