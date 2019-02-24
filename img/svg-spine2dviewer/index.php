<?php

$nb_fichier = 0;
echo '<div>';

if($dossier = opendir('.')){

  while (false !== ( $fichier = readdir($dossier))) {

    if ($fichier !== '.' && $fichier !== '..' && $fichier !== 'index.php' && strpos($fichier, '.svg') ) {

      $nb_fichier ++;
      echo '<p><a href="./' . $fichier .'">' . $fichier .'</a></p>';
    }
  }

  closedir($dossier);
}else {

  echo "<p>what the hell</p>";
}
echo '</div>';


 ?>
