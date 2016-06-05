var AnimationsList;
var SkinsList;

function addControls()
{





  /* Controls Actions */
  $('#play').mouseup( function(){
      anSk.setAnimation(0,currentAnimation,true);
      logIt('play');
    }


  )
  $('#stop').mouseup( function(){
      anSk.setAnimation(0,currentAnimation,false);
      logIt('stop');
    }


  )
  $('#speed-x0-5').mouseup( function(){
      anSk.setTimeScale(0.5);
      logIt('set speed to 0.5');
    }


  )
  $('#speed-x1-0').mouseup( function(){
      anSk.setTimeScale(1);
      logIt('set speed to 1.0');
    }


  )
  $('#speed-x1-5').mouseup( function(){
      anSk.setTimeScale(1.5);
      logIt('set speed to 1.5');
    }


  )
  $('#speed-x2-0').mouseup( function(){
      anSk.setTimeScale(2);
      logIt('set speed to 2.0');
    }


  )

  $('#scale-x0-5').mouseup( function(){

      anSk.scale = currentScaleTemp = currentScale*0.5;
      logIt('multiply scale x0.5');
    }


  )
  $('#scale-x1-0').mouseup( function(){

      anSk.scale  = currentScaleTemp = currentScale;
      logIt('multiply scale x1.0');
    }


  )
  $('#scale-x1-5').mouseup( function(){

      anSk.scale = currentScaleTemp= currentScale*1.5;
      logIt('multiply scale x0.5');
    }


  )
  $('#scale-x2-0').mouseup( function(){

      anSk.scale  = currentScaleTemp = currentScale*2;
      logIt('multiply scale x2.0');
    }


  )

  $('#x2-0').mouseup( function(){
      anSk.setTimeScale(2);
      logIt('set speed to 2.0');
    }
  )
  /* library Actions */

}
function buildLibrary(){

  $.getJSON(s_textureJSON, function (data){
    getAnimationsAndSkins(data);
    setAnimationsAndSkinsActions();

  })
}

function setAnimationsAndSkinsActions()
{
  logIt('setAnimationsAndSkinsActions');
  $.each($('.animations-list .list-group a'), function(i){

    $(this).mousedown(function(){
      anSk.setAnimation(0,String(AnimationsList[i]), true);
      currentAnimation = String(AnimationsList[i]);
      logIt('set current animation: '+currentAnimation);
    })

  });
  currentAnimation = AnimationsList[0];
  $.each($('.skins-list .list-group a'), function(j){

    $(this).mousedown(function(){

      logIt(String(SkinsList[j]));

      anSk.updateWorldTransform();
      anSk.setSkin(String(SkinsList[j]));
      anSk.setSlotsToSetupPose();
      currentSkin = String(SkinsList[j]);
      logIt('set current skin: '+currentSkin);

    })

  });

  console.log(SkinsList.length , 'SkinsList.length ');
  if(SkinsList.length > 1){
    currentSkin  = SkinsList[1];
  }else{
    currentSkin  = SkinsList[0];
  }
}

function getAnimationsAndSkins(data)
{
  console.log('construct htmlBloc .. ');
  var newAnHtml = '<div class="list-group">';
  var newSkHtml = '<div class="list-group">';

  /*Animations*/
  var an = AnimationsList = Object.keys(data.animations);
  for (var i = 0; i < an.length; i++) {

    newAnHtml += '<a href="#" class="list-group-item" id="anim_'+i+'"><img src="icons/dot_grey.png"></img> '+ String(an[i]) +'</a>';
  }
  newAnHtml += "</div>";
  console.log('animations-list',newAnHtml);
  $('#animations-list').html(newAnHtml);


  /*Skins*/
  var sk = SkinsList = Object.keys(data.skins);
  for (var i = 0; i < sk.length; i++) {

    newSkHtml += '<a href="#" class="list-group-item" id="skin_'+i+'"><img src="icons/dot_grey.png"></img> '+ String(sk[i]) +'</a>';
  }
  newSkHtml += "</div>";
  console.log('skins-list',newSkHtml);
  $('#skins-list').html(newSkHtml);
}
