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
try {
    // Prepare SELECT statement to fetch user preferences
    $stmt = $db->prepare("SELECT temperature_unit, distance_unit, precipitation_unit, wind_unit FROM preferences WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($temperature_unit, $distance_unit, $precipitation_unit, $wind_unit);
    $stmt->fetch();
    $stmt->close();

} catch (Exception $e) {
    // Handle errors
    http_response_code(500); // Internal Server Error
    exit("Error: " . $e->getMessage());
}

// adds to the title tag
$title = "Home";
    
// completes the CSS filename
$filename = "index";


// Render view
echo $twig->render($filename . '.html', [
    'title' => $title, 
    'filename' => $filename, 
    'logged_in' => $_SESSION['logged_in'],
    'temperature_unit' => $temperature_unit,
    'distance_unit' => $distance_unit,
    'precipitation_unit' => $precipitation_unit,
    'wind_unit' => $wind_unit
]);
?>

<script>
    var preferences = <?php echo json_encode([
        'temperature_unit' => $temperature_unit,
        'distance_unit' => $distance_unit,
        'precipitation_unit' => $precipitation_unit,
        'wind_unit' => $wind_unit
    ]); ?>;
</script>
