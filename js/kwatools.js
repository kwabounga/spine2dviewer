var testMode = true;

// constantes pour les styles css debug
var NORMAL = "normal";
var ALERT = "alert";
var INFOS = "infos";
var VALIDE = "valide";
var FUNCTION = "function";
var CONSTRUC = "construc";
var METHODE = "methode";

// CSS For debug console
var styleWarning = ['color: red', 'font-weight: bold'].join(';');
var styleInfo = ['color: blue', 'font-weight: bold'].join(';');
var styleValide = ['color: green', 'font-weight: bold', 'font-family: verdana', 'font-size: 10pt'].join(';');
var styleFunction = ['font-style: italic', 'color: SteelBlue '].join(';');
var styleConstruc = ['font-style: italic', 'color: teal '].join(';');
var styleMethode = ['font-style: italic', 'color: olive '].join(';');


// return a pseudo randomBoolean with a pseudo percentage of 'true'
function randomBoolean(_percent = 20) {
  var rdBoo = Math.floor(Math.random() * 100);
  return (rdBoo > _percent) ? 0 : 1;
}

// return a random integer
function randomFloored(_num) {
  return Math.floor(Math.random() * _num);
}

// print debug
// the debug output on the web page is for mobile dev issues ( like no dev panel on chrome mobile)
function debug(message, special = "normal") {
  if (testMode) {

    switch (special) {
      case "infos":
        console.log('%c' + message, styleInfo);
        $("#output").html('<p><span style="' + styleInfo + '">' + String(message) + '</span></p>');
        break;
      case "alert":
        console.log('%c' + message, styleWarning);
        $("#output").html('<p><span style="' + styleWarning + '"><strong>' + String(message) + '</strong></span></p>');
        break;
      case "valide":
        console.log('%c' + message, styleValide);
        $("#output").html('<p><span style="' + styleValide + '">' + String(message) + '</span></p>');
        break;
      case "function":
        console.log('%c' + message, styleFunction);
        $("#output").html('<p><span style="' + styleFunction + '"><code>' + String(message) + '</code></span></p>');
        break;
      case "construc":
        console.log('%c' + message, styleConstruc);
        $("#output").html('<p><span style="' + styleConstruc + '"><code>' + String(message) + '</code></span></p>');
        break;
      case "methode":
        console.log('%c' + message, styleMethode);
        $("#output").html('<p><span style="' + styleMethode + '"><code>' + String(message) + '</code></span></p>');
        break;
      default:
        console.log(message);
        $("#output").html('<p>' + String(message) + '</p>');
    }
    // console.log(message);
    try {
      // for visual log confort
      // always reset the textfield focus on the last log
      var element = document.getElementById("output");
      element.scrollTop = element.scrollHeight;
    } catch (e) {
      // console.warn('no <output> element on DOM');
    }
  } else {
    // hide the out put if testMode is set to false
    $("#output").addClass("invisible");
    $("#output").html('');
  }
}

function output(message) {
  console.log(message);
  $("#output p").html(String(message));
}
