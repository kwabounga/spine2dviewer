output('voici un test de test testant');
// output('un testeur sachant tester doit savoir tester sans son test');
// output('un testeur sachant tester doit savoir tester sans son test lalala c'est super cool de coder youhou c'est la fete du slip');

function hidelogo() {
  $("#logo").addClass("invisible");
  $("#content").removeClass("blured");
}
// pseudo constructor here
$(document).ready(function() {
  setTimeout(function() {
    hidelogo();
    initApp();
  }, 2000);
});
// init function  ( cf: viewport.js  )
function initApp() {
  initviewPort();
}
