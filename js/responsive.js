window.onresize = function() {
  console.log(resetCanvasSize());
};
window.addEventListener('resize', function() {
  resetCanvasSize()
});

function resetCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.style.width = canvas.width + 'px';
  canvas.height = window.innerHeight;
  canvas.style.height = canvas.height + 'px';
  reSizeAnimation();
  return false;
}

/// Tools
function reSizeAnimation() {
  debug('reSizeAnimation', FUNCTION);
}

function windowsSize(elmt, less) {
  var heightElmt;
  var widthElmt;

  if (typeof(window.innerWidth) == 'number') {
    heightElmt = window.innerHeight;
    widthElmt = window.innerWidth;
  } else if (document.documentElement && document.documentElement.clientHeight) {
    heightElmt = document.documentElement.clientHeight;
    widthElmt = document.documentElement.clientWidth;
  }

  var resultH = less ? (heightElmt - less) : heightElmt;
  var resultW = widthElmt - (16.6 * widthElmt / 100);
  elmt.height(resultH);
  elmt.width(resultW);
}
