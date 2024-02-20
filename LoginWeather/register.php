<?php

//This brings in a twig instance for use by this script
require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/database.php';
require_once 'gen-php/clean_input.php';
require_once 'gen-php/validate.php';

//Load from the DB
$db = new Db();

//Check if we need to filter
if(isset($_GET['type'])) 
{
    $typeSelected = $db -> quote($_GET["type"]);
}
else
{
    $typeSelected = -1;
}

//Handle form submission
$error_message = '';
$validations = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //Get the user's information from the form
    $name       = $db -> quote( clean_input( $_POST['name']       ) );
    $surname    = $db -> quote( clean_input( $_POST['surname']    ) );
    $email      = $db -> quote( clean_input( $_POST['email']      ) );
    $password   = $db -> quote( clean_input( $_POST['password']   ) );
    $confirmPassword   = $db -> quote( clean_input( $_POST['confirmPassword']   ) );
    
    // preparing required variables for validation
    $formvalues['name'] = $name;
    $formvalues['surname'] = $surname;
    $formvalues['email'] = $email;
    $formvalues['password'] = $password;
    
    // validate
    [$formvalues, $validations] = validateName($formvalues, $validations);
    [$formvalues, $validations] = validateSurname($formvalues, $validations);
    [$formvalues, $validations] = validateEmail($formvalues, $validations);
    [$formvalues, $validations] = validateString($formvalues, $validations, 'password');
    if ($password == $confirmPassword){
        ;
    } else {
        $validation['confirmPasswordError'] = 'Password does not match.';
    }
    
    // update variables for continuation of script
    $name = $formvalues['name'];
    $surname = $formvalues['surname'];
    $email = $formvalues['email'];
    $password = $formvalues['password'];
    
    $password = password_hash($password, PASSWORD_DEFAULT);

    if (count($validations) == 0){ // prevent further execution if validation errors occur
        //Check if email already exists in database
        $stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_array(MYSQLI_NUM);
        $user_count = $row[0];
        if ($user_count > 0) {
            //Display error message
            $error_message = "User already registered";
        } else {
            //Insert the user's information into the database
            $stmt = $db->prepare('INSERT INTO users(name, surname, email, password) VALUES (?, ?, ?, ?)');
            $stmt->bind_param('ssss', $name, $surname, $email, $password);
            $stmt->execute();
            header('Location: login.php');

        }
    }
}

// adds to the title tag
$title = "Register";
    
// completes the CSS filename
$filename = "register";

// Render view
echo $twig->render($filename . '.html', ['title' => $title, 'filename' => $filename, 'error_message' => $error_message, 'validations' => $validations]);
