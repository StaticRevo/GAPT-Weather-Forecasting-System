<?php
    session_start();
    $_SESSION['logged_in'] = false;
    session_unset();
    header('Location: ../index.php');
    exit;




