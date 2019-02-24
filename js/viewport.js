goog.provide( 'main' );
goog.require( 'spine' );
goog.require( 'atlas' );
goog.require( 'RenderCtx2D' );

/** infos skeleton **/
var currentSkeleton = "raptor";
var currentAnimation = 'run';
var currentSkin = 'default';
var currentScale = 1;
var currentScaleTemp = 1;

/** variables for loading skeletons **/
var dirData = "/interface-web-spinejs/animations/";
var s_texture = dirData + currentSkeleton + ".png";
var s_textureJSON = dirData + currentSkeleton + ".json";
var s_textureATLAS = dirData + currentSkeleton + ".atlas";

/** spine Skeleton Animation **/
var dragging = false;
var prevMousePosX;
var prevMousePosY;
var isOnPc = false;

var canvas;
var ctx;
var render_ctx2d;

var spine_data = null;
var spine_pose = null;
var spine_pose_next = null;
var atlas_data = null;

var anim_time = 0;
var anim_length = 0;
var anim_length_next = 0;
var anim_rate = 1;
var anim_repeat = 2;
var anim_blend = 0.0;

var files = [];
var file_index = 0;
var skin_index = 0;
var anim_index = 0;


var loading = false;
var prev_time = 0;
var alpha = 1.0;
var enable_render_debug_data = false;
var enable_render_debug_pose = false;
var camera_x;
var camera_y;
var camera_zoom;
var enable_render_ctx2d;
var idLoopAuto = null;

var MODE_DEMO = false;

/** Kill viewer, reinit skeleton infos, restart viewport **/
function killviewport( newSkeleton ) {
  debug( newSkeleton );
  currentSkeleton = newSkeleton;
  var fileId = allSkeletons.lastIndexOf( newSkeleton );
  var file = files[ fileId ];
  s_textureJSON = dirData + file.json_url;
  s_texture = dirData + currentSkeleton + ".png";
  debug( s_textureJSON );
  loading = true;
  loadFile( file, function () {
    loading = false;
    updateFile();
  } );
  /*first init*/
  buildLibrary();
  $( ".filename" ).html( currentSkeleton + '.png /.atlas /.json' );
  getFileSize( s_texture );
  refreshDate();
}

function getFileSize( url ) {
  var fSize;
  var txtFSize;
  var xhr = new XMLHttpRequest();
  xhr.open( 'HEAD', url, true );
  xhr.onreadystatechange = function () {
    if ( xhr.readyState == 4 ) {
      if ( xhr.status == 200 ) {
        fSize = xhr.getResponseHeader( 'Content-Length' );
        debug( fSize );
        if ( fSize >= 1024 ) {
          txtFSize = round( fSize / 1024 ) + ' kO';
          if ( ( fSize / 1024 ) >= 1024 ) txtFSize = round( ( fSize / 1024 ) / 1024 ) + ' mO';
        } else {
          txtFSize = fSize + " octets";
        }
        $( ".filesize" ).html( txtFSize );
      } else {
        alert( 'ERROR' );
      }
    }
  };
  xhr.send( null );
}

function round( num ) {
  return Math.round( num * 1000 ) / 1000;
}
/** reinitialisation of menus**/
function initviewPort() {
  var file = files[ file_index ];
  s_textureJSON = dirData + file.json_url;
  currentSkeleton = allSkeletons[ file_index ];

  //build library and set currentSkeleton
  buildLibrary();
  $( ".filename" ).html( currentSkeleton + '.png /.atlas /.json' );
  getFileSize( s_texture );
  refreshDate();
  console.log( s_texture, s_textureATLAS, s_textureJSON );

  //redefinition de" la taille du canvas et attributs
  canvas = document.getElementById( 'viewport-canvas' );
  canvas.width = $( "#cocoviewport" ).width();
  canvas.height = $( "#cocoviewport" ).height();
  debug( $( "#cocoviewport" ).width() );
  debug( $( "#cocoviewport" ).height() );
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  //variables redefinition
  camera_x = 0;
  camera_y = canvas.height / 2;
  camera_zoom = $( "#myRange" ).val() / 100;
  ctx = canvas.getContext( '2d' );
  render_ctx2d = new RenderCtx2D( ctx );
  enable_render_ctx2d = !!ctx; //&& !enable_render_webgl;
  enable_render_debug_data = $( "#bounding-box" ).is( ':checked' );
  enable_render_debug_pose = $( "#bones" ).is( ':checked' );

  // load next Files
  loading = true;
  loadFile( file, function () {
    loading = false;
    updateFile();
  } );
  loop();
  addControls();

};



var idAlerter;

function alerter( msg, style = 'good' ) {
  if ( idAlerter ) clearTimeout( idAlerter );
  debug( msg );
  $( "#alerter" ).removeClass( 'wrong' );
  $( "#alerter" ).removeClass( 'good' );
  $( "#alerter" ).html( '' );
  var p = document.createElement( 'p' );
  var m = document.createTextNode( msg );
  p.appendChild( m );
  $( "#alerter" ).html( p );
  $( "#alerter" ).removeClass( 'invisible' );
  $( "#alerter" ).addClass( 'alerter' );
  $( "#alerter" ).addClass( style == 'good' ? 'good' : 'wrong' );
  idAlerter = setTimeout( removeAlerter, 2000 );

}

function removeAlerter() {
  $( "#alerter" ).removeClass( 'alerter' );
  $( "#alerter" ).addClass( 'invisible' );
  clearTimeout( idAlerter );
}
var idDate;

function refreshDate() {
  if ( idDate ) clearTimeout( idDate );
  var ms = 1000;
  var s = 60;
  idDate = setTimeout( refreshDate, s * ms ); // every min
  var date = new Date();
  $( ".otherinfos .time" ).html( date.getHours() + ':' + date.getMinutes() );

}
var loadFile = function ( file, callback ) {
  render_ctx2d.dropData( spine_data, atlas_data );
  // render_webgl.dropData(spine_data, atlas_data);

  spine_data = null;
  spine_pose = null;
  spine_pose_next = null;
  atlas_data = null;

  var file_path = file.path;
  var file_json_url = file_path + file.json_url;
  var file_atlas_url = ( file.atlas_url ) ? ( file_path + file.atlas_url ) : ( "" );

  loadText( file_json_url, function ( err, json_text ) {
    if ( err ) {
      callback();
      return;
    }

    spine_data = new spine.Data().load( JSON.parse( json_text ) );
    spine_pose = new spine.Pose( spine_data );
    spine_pose_next = new spine.Pose( spine_data );

    loadText( file_atlas_url, function ( err, atlas_text ) {
      var images = {};

      var counter = 0;
      var counter_inc = function () {
        counter++;
      }
      var counter_dec = function () {
        if ( --counter === 0 ) {
          render_ctx2d.loadData( spine_data, atlas_data, images );
          // render_webgl.loadData(spine_data, atlas_data, images);
          callback();
        }
      }

      counter_inc();

      if ( !err && atlas_text ) {
        atlas_data = new atlas.Data().import( atlas_text );

        // load atlas page images
        var dir_path = file_atlas_url.slice( 0, file_atlas_url.lastIndexOf( '/' ) );
        atlas_data.pages.forEach( function ( page ) {
          var image_key = page.name;
          var image_url = dir_path + "/" + image_key;
          counter_inc();
          images[ image_key ] = loadImage( image_url, ( function ( page ) {
            return function ( err, image ) {
              if ( err ) {
                console.log( "error loading:", image && image.src || page.name );
              }
              page.w = page.w || image.width;
              page.h = page.h || image.height;
              counter_dec();
            }
          } )( page ) );
        } );
      } else {
        // load attachment images
        spine_data.iterateSkins( function ( skin_key, skin ) {
          skin.iterateAttachments( function ( slot_key, skin_slot, attachment_key, attachment ) {
            if ( !attachment ) {
              return;
            }
            switch ( attachment.type ) {
              case 'region':
              case 'mesh':
              case 'weightedmesh':
                var image_key = attachment_key;
                var image_url = file_path + spine_data.skeleton.images + image_key + ".png";
                counter_inc();
                images[ image_key ] = loadImage( image_url, function ( err, image ) {
                  if ( err ) {
                    console.log( "error loading:", image.src );
                  }
                  counter_dec();
                } );
                break;
            }
          } );
        } );
      }

      counter_dec();
    } );
  } );
}

var add_file = function ( name ) {
  var file = {};
  file.path = '/interface-web-spinejs/animations/';
  file.json_url = name + '.json';
  file.atlas_url = name + '.atlas' || "";
  allSkeletons.push( name );
  files.push( file );
}

function updateFile() {
  skin_index = 0;
  updateSkin();
  anim_index = 0;
  updateAnim();
  currentAnimation = String( AnimationsList[ anim_index ] );
  alerter( 'load ' + currentSkeleton + ' with ' + currentAnimation + ' animation' );
}

function updateSkin() {
  var skin_key = spine_data.skin_keys[ skin_index ];
  spine_pose.setSkin( skin_key );
  spine_pose_next.setSkin( skin_key );
}

function updateAnim() {
  var anim_key = spine_data.anim_keys[ anim_index ];
  spine_pose.setAnim( anim_key );
  var anim_key_next = spine_data.anim_keys[ ( anim_index + 1 ) % spine_data.anim_keys.length ];
  spine_pose_next.setAnim( anim_key_next );
  spine_pose.setTime( anim_time = 0 );
  spine_pose_next.setTime( anim_time );
  anim_length = spine_pose.curAnimLength() || 1000;
  anim_length_next = spine_pose_next.curAnimLength() || 1000;

}

function loadText( url, callback ) {
  var req = new XMLHttpRequest();
  if ( url ) {
    req.open( "GET", url, true );
    req.responseType = 'text';
    req.addEventListener( 'error', function () {
      callback( "error", null );
    } );
    req.addEventListener( 'abort', function () {
      callback( "abort", null );
    } );
    req.addEventListener( 'load', function () {
      if ( req.status === 200 ) {
        callback( null, req.response );
      } else {
        callback( req.response, null );
      }
    } );
    req.send();
  } else {
    callback( "error", null );
  }
  return req;
}


function loadImage( url, callback ) {
  var image = new Image();
  image.crossOrigin = "Anonymous";
  image.addEventListener( 'error', function () {
    callback( "error", null );
  } );
  image.addEventListener( 'abort', function () {
    callback( "abort", null );
  } );
  image.addEventListener( 'load', function () {
    callback( null, image );
  } );
  image.src = url;
  return image;
}

function isOnMobile() {
  if ( /iPhone|iPod|Android|opera mini|blackberry|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|windows ce|opera mobi|windows ce; smartphone;|windows ce;iemobile/i.test( navigator.userAgent ) ) {
    debug( 'ONMOBILE' );
    return true;
  } else {
    debug( 'ONPC' );
    return false;
  }
}
var loop = function ( time ) {
  requestAnimationFrame( loop );

  var dt = time - ( prev_time || time );
  prev_time = time; // ms

  if ( !loading ) {
    spine_pose.update( dt * anim_rate );
    var anim_rate_next = anim_rate * anim_length_next / anim_length;
    spine_pose_next.update( dt * anim_rate_next );

    anim_time += dt * anim_rate;

    if ( MODE_DEMO ) {
      if ( anim_time >= ( anim_length * anim_repeat ) ) {
        if ( ++anim_index >= spine_data.anim_keys.length ) {
          anim_index = 0;
          if ( ++skin_index >= spine_data.skin_keys.length ) {
            skin_index = 0;
            if ( files.length > 1 ) {
              if ( ++file_index >= files.length ) {
                file_index = 0;
              }
              file = files[ file_index ];
              // messages.innerHTML = "loading";
              loading = true;
              loadFile( file, function () {
                loading = false;
                updateFile();
              } );
              return;
            }
          }
          updateSkin();
        }
        updateAnim();
      }

    }
    var skin_key = spine_data.skin_keys[ skin_index ];
    var anim_key = spine_data.anim_keys[ anim_index ];
    var anim_key_next = spine_data.anim_keys[ ( anim_index + 1 ) % spine_data.anim_keys.length ];
    // messages.innerHTML = "skin: " + skin_key + ", anim: " + anim_key + ", next anim: " + anim_key_next + "<br>" + file.path + file.json_url;
  }

  if ( ctx ) {
    ctx.setTransform( 1, 0, 0, 1, 0, 0 );
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
  }

  // if (gl) {
  //   gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  //   gl.clearColor(0, 0, 0, 0);
  //   gl.clear(gl.COLOR_BUFFER_BIT);
  // }

  if ( loading ) {
    return;
  }

  spine_pose.strike();

  //spine_pose.events.forEach(function (event) { console.log("event", event.name, event.int_value, event.float_value, event.string_value); });

  if ( anim_blend > 0 ) {
    spine_pose_next.strike();

    // blend next pose bone into pose bone
    spine_pose.iterateBones( function ( bone_key, bone ) {
      var bone_next = spine_pose_next.bones[ bone_key ];
      if ( !bone_next ) {
        return;
      }
      spine.Space.tween( bone.local_space, bone_next.local_space, anim_blend, bone.local_space );
    } );

    // compute bone world space
    spine_pose.iterateBones( function ( bone_key, bone ) {
      spine.Bone.flatten( bone, spine_pose.bones );
    } );
  }

  if ( ctx ) {
    ctx.globalAlpha = alpha;

    // origin at center, x right, y up
    ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );
    ctx.scale( 1, -1 );

    // if (enable_render_ctx2d && enable_render_webgl) {
    //   ctx.translate(-ctx.canvas.width / 4, 0);
    // }

    ctx.translate( -camera_x, -camera_y );
    ctx.scale( camera_zoom, camera_zoom );
    ctx.lineWidth = 1 / camera_zoom;

    if ( enable_render_ctx2d ) {
      render_ctx2d.drawPose( spine_pose, atlas_data );
    }

    if ( enable_render_debug_data ) {
      render_ctx2d.drawDebugData( spine_pose, atlas_data );
    }

    if ( enable_render_debug_pose ) {
      render_ctx2d.drawDebugPose( spine_pose, atlas_data );
    }
  }

}