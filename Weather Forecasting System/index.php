<?php

//This brings in a twig instance for use by this script
require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/database.php';
require_once 'gen-php/loginlogic.php';

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


// adds to the title tag
$title = "Home";
    
// completes the CSS filename
$filename = "index";

// Render view
echo $twig->render($filename . '.html', [
    'title' => $title, 
    'filename' => $filename, 
    'logged_in' => $_SESSION['logged_in']
]);
//echo $twig->render("index.html");
