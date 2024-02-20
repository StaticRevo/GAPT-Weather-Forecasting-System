<?php
    function clean_input($data) {
        $data = trim($data);
        //stripslashes(): The stripslashes() function removes backslashes.
        $data = stripslashes($data);
        //htmlspecialchars(): Convert special characters to HTML entities.
        $data = htmlspecialchars($data);
        return $data;
    }
?>
