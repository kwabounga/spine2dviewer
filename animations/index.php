<?php

// Open directory
$directory = opendir('.');
if ($directory === false)
{
    header('HTTP/1.1 500 Internal Server error');
    die('Unable to open directory');
}

// Get list of PNG file
$images = array();
while (($file = readdir($directory)) !== false) {
    $explodedString = explode('.', $file);
    if (is_array($explodedString) && count($explodedString) == 2 && $explodedString[1] == 'png') {
        $images[] = $explodedString[0];
    }
}

// Returns images in JSON format
closedir($directory);
die(json_encode($images));
