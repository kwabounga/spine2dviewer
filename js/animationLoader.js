var allSkeletons = [];

//Get Alls Skeletons from server folder
$.ajax( {
  url: "./animations/index.php",
  success: function ( data ) {
    log( 'data loaded', data );
    var images = jQuery.parseJSON( data.toString() );
    addSkeleton( images );
  },
  error: function ( data ) {
    alerter( 'error' + data, 'wrong' );

    // Set default skeletons
    var images = [ "boss_01", "raptor", "robot_gun_walk", "runner" ];
    addSkeleton( images )
  }
} );

function addSkeleton( images ) {
  $.each( images, function ( index, image ) {
    debug( "Found a Skeleton: " + image );
    add_file( image );
  } );

  // Build Dropdown menu from skeleton Array
  debug( "allSkeletons; " + images, ALERT );
  constructAnimationDropDownButton( images );
}

function constructAnimationDropDownButton( skeletons ) {
  var htmlDropDown = '';
  if ( !skeletons ) return;

  $( '#myDropdown' ).html( '' );
  $( skeletons ).each( function ( i ) {
    var a = document.createElement( 'a' );
    var skName = String( allSkeletons[ i ] );
    a.appendChild( document.createTextNode( skName ) );
    $( '#myDropdown' ).append( a );
  } );

  $( "#myDropdown a" ).each( function ( i ) {
    $( this ).mousedown( function () {
      debug( 'loading: ' + String( allSkeletons[ i ] ) );
      killviewport( String( allSkeletons[ i ] ) );
    } );
  } );

  window.onclick = function ( e ) {
    if ( !e.target.matches( '.dropdownBtn' ) ) {
      var myDropdown = document.getElementById( "myDropdown" );
      if ( myDropdown.classList.contains( 'show' ) ) {
        myDropdown.classList.remove( 'show' );
      }
    }
  }

  $( "#dropdownBtn" ).mouseup( function () {
    debug( 'dropdownBtn click' );
    document.getElementById( "myDropdown" ).classList.toggle( "show" );
  } )
}
