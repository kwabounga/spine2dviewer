function addControls() {
  //// TODO: add play stop event n bt
  $('#play').mouseup(function() {
    alerter('play');
  });

  $('#stop').mouseup(function() {
    alerter('stop');
  });

  $('#bt_speed05').mouseup(function() {
    anim_rate = 0.5;
    alerter('set speed to 0.5');
  });

  $('#bt_speed10').mouseup(function() {
    anim_rate = 1.0;
    alerter('set speed to 1.0');
  });

  $('#bt_speed20').mouseup(function() {
    anim_rate = 2.0;
    alerter('set speed to 1.5');
  });

  $('#bt_speed20').mouseup(function() {
    alerter('set speed to 2.0');
  });

  $('#bt_minimize').mouseup(function() {
    camera_zoom = 0.5;
    $("#myRange").val(camera_zoom * 100);
    ctx.scale(camera_zoom, camera_zoom);
    alerter('multiply scale x0.5');
  });

  $('#bt_original').mouseup(function() {

    camera_zoom = 1.0;
    $("#myRange").val(camera_zoom * 100);
    ctx.scale(camera_zoom, camera_zoom);
    alerter('multiply scale x1.0');
  });

  $('#mini_bt_original').mouseup(function() {
    camera_zoom = 1.0;
    $("#myRange").val(camera_zoom * 100);
    ctx.scale(camera_zoom, camera_zoom);
    alerter('multiply scale x1.0');
  });

  $('#bt_maximize').mouseup(function() {
    camera_zoom = 2.0;
    $("#myRange").val(camera_zoom * 100);
    ctx.scale(camera_zoom, camera_zoom);
    alerter('multiply scale x2.0');
  });

  $('#x2-0').mouseup(function() {
    alerter('set speed to 2.0');
  });

  $('#demo').mouseup(function() {
    if (MODE_DEMO) {
      $('#demo').removeClass('validated');
      $('#viewport').removeClass('validated');
      $('#viewport').addClass('normalized');
      MODE_DEMO = false;
      alerter('END DEMO MODE', 'wrong');
    } else {
      $('#viewport').removeClass('normalized');
      $('#viewport').addClass('validated');
      $('#demo').addClass('validated');
      MODE_DEMO = true;
      alerter('DEMO MODE');
    }
  });

  var Wheeler = function(evt) {
    debug('Wheeler' + evt.wheelDelta);
    var newval = $("#myRange").val();
    debug('OLD:' + newval);
    if (evt.wheelDelta > 0 || evt.detail < 0) {
      newval = Number(newval) + 5;
      $("#myRange").val(newval);
    } else {
      newval = newval - 5;
      $("#myRange").val(newval);
    }
    debug('NEW:' + newval);
    if (newval < 0) newval = 1;
    if (newval > 400) newval = 400;

    camera_zoom = newval / 100;
    ctx.scale(camera_zoom, camera_zoom);
    alerter('new zoom: ' + camera_zoom);
  }

  var isDragging = false;
  document.getElementById("cocoviewport").addEventListener("mousedown", function(evt) {
    isDragging = true;
  });

  document.getElementById("cocoviewport").addEventListener("mousemove", function(evt) {
    if (isDragging) dragger(evt);
  });

  document.getElementById("cocoviewport").addEventListener("mouseup", function(evt) {
    isDragging = false;
  });

  var dragger = function(evt) {
    if (isWalk) return;
    debug('grag it: ' + evt.movementX);
    camera_x -= evt.movementX;
    camera_y += evt.movementY;
  }
  var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  document.getElementById("cocoviewport").addEventListener(mousewheelevt, function(evt) {
    Wheeler(evt);
  });

  document.getElementById("myRange").addEventListener(mousewheelevt, function(evt) {
    Wheeler(evt);
  });

  $("#myRange").change(function() {
    debug('myRange change');
    var newval = $(this).val();
    camera_zoom = newval / 100;
    $("#myRange").val(camera_zoom * 100);
  });

  var isWalk = false;
  var customspeed = $('#walk-speed').val();
  var moverID;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function moveCamera() {
    var reverse = customspeed < 0;
    camera_x += reverse ? Math.abs(customspeed) : -Math.abs(customspeed);
    debug("camera_x: " + camera_x);
    moverID = requestAnimationFrame(moveCamera);
    if (reverse) {
      if (camera_x >= 1000) camera_x = -1000;
    } else {
      if (camera_x <= -1000) camera_x = 1000;
    }
  }

  document.getElementById("walk-speed").addEventListener("wheel", function(evt) {
    changeSpeed(evt);
  });

  function changeSpeed(evt) {
    var delta = evt.wheelDelta;
    debug(delta);

    if (customspeed != 0) {
      if (!isWalk) {
        isWalk = true;
        move();
      }
    }

    if (delta > 0) {
      customspeed += 0.5;
      $('#walk-speed').val(customspeed);
    } else if (delta < 0) {
      customspeed -= 0.5;
      $('#walk-speed').val(customspeed);
    }
    if (customspeed == 0) {
      isWalk = false;
      move();
    }
  }

  function move() {
    debug('move');
    if (isWalk) {
      currentAnSkPosX = camera_x;
      customspeed = $('#walk-speed').val();
      moverID = requestAnimationFrame(moveCamera);

      $('#bt_move').removeClass('normalized');
      $('#bt_move').addClass('validated');
      $('#walk-speed').addClass('validated');
    } else {
      camera_x = currentAnSkPosX;
      cancelAnimationFrame(moverID);
      
      $('#walk-speed').removeClass('validated');
      $('#bt_move').removeClass('validated');
      $('#bt_move').addClass('normalized');
    }
  }

  $("#walk-speed").change(function() {
    alerter('walk-speed is set to:' + $(this).val());
    customspeed = $(this).val();
  });

  $("#bt_move").mouseup(function() {
    debug('bt-move mouseup');
    isWalk = !isWalk;
    alerter(isWalk ? 'PRESS: move start' : 'PRESS: move stop', isWalk ? 'good' : 'wrong');
    move();
  });

  document.addEventListener('keydown', function(event) {
    debug(event.keyCode);
    if (event.keyCode == 32) {
      isWalk = !isWalk;
      alerter(isWalk ? 'SPACE: move start' : 'SPACE: move stop', isWalk ? 'good' : 'wrong');
      move();
    } else if (event.keyCode == 27) {
      if (isWalk) {
        alerter('ESCAP: move stop', 'wrong');
        isWalk = false;
        move();
      }
    } else if (event.keyCode == 38) {

      --anim_index;
      if (anim_index < 0) anim_index = AnimationsList.length - 1;
      currentAnimation = String(AnimationsList[anim_index]);
      updateAnim();
      alerter('SWAP ANIM: ' + currentAnimation);
    } else if (event.keyCode == 40) {
      ++anim_index;
      if (anim_index > AnimationsList.length - 1) anim_index = 0;
      currentAnimation = String(AnimationsList[anim_index]);
      updateAnim();
      alerter('SWAP ANIM: ' + currentAnimation);
    } else if (event.keyCode == 39) {
      --skin_index;
      if (skin_index < 0) skin_index = SkinsList.length - 1;
      currentSkin = String(SkinsList[skin_index]);
      updateAnim();
      alerter('SWAP SKIN: ' + currentSkin);
    } else if (event.keyCode == 37) {
      ++skin_index;
      if (skin_index > SkinsList.length - 1) skin_index = 0;
      currentSkin = String(SkinsList[skin_index]);
      updateAnim();
      alerter('SWAP SKIN: ' + currentSkin);
    }
  });

  $("#btnHelp").mouseup(function() {
    $("#help").removeClass('invisible');
    debug('HELP')
  });

  $("#btnHelp").mouseout(function() {
    $("#help").addClass('invisible');
  });

  $("#bounding-box").change(function() {
    debug('bounding-box CHANGE');
    if ($(this).is(':checked')) {
      enable_render_debug_data = true;
    } else {
      debug('false');
      enable_render_debug_data = false;
    }
    alerter('enable_render_debug_data: ' + enable_render_debug_data, enable_render_debug_data ? 'good' : 'wrong');
  });

  $("#bones").change(function() {
    debug('bones CHANGE');
    if ($(this).is(':checked')) {
      debug('true');
      enable_render_debug_pose = true;
    } else {
      debug('false');
      enable_render_debug_pose = false;
    }
    alerter('enable_render_debug_pose: ' + enable_render_debug_pose, enable_render_debug_pose ? 'good' : 'wrong');
  });

}
