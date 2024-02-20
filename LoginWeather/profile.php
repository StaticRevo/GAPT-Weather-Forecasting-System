<?php

require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/database.php';
require_once 'gen-php/loginlogic.php';

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

// adds to the title tag
$title = "Profile";
    
// completes the CSS filename
$filename = "profile";

// Render view
echo $twig->render($filename . '.html', ['title' => $title, 'filename' => $filename, 'user' => $user, 'logged_in' => $_SESSION['logged_in']]);
