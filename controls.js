/*$(function(){
  console.log('doc ready');
  //addControls();


});
*/
var AnimationsList;
var SkinsList;
function addControls()
{
  //MyScene
  //anSk
  /* Loader Action */



  /* Controls Actions */
  $('#play').mouseup( function(){
      anSk.setAnimation(0,currentAnimation,true);
      console.log('play mouseup');
    }


  )
  $('#stop').mouseup( function(){
      anSk.setAnimation(0,currentAnimation,false);
      console.log('stop mouseup');
    }


  )
  $('#x0-5').mouseup( function(){
      anSk.setTimeScale(0.5);
      console.log('set speed to 0.5');
    }


  )
  $('#x1-0').mouseup( function(){
      anSk.setTimeScale(1);
      console.log('set speed to 1.0');
    }


  )
  $('#x1-5').mouseup( function(){
      anSk.setTimeScale(1.5);
      console.log('set speed to 1.5');
    }


  )
  $('#x2-0').mouseup( function(){
      anSk.setTimeScale(2);
      console.log('set speed to 2.0');
    }


  )
  /* library Actions */
  buildLibrary();
  $('#x2-0').mouseup( function(){
      anSk.setTimeScale(2);
      console.log('set speed to 2.0');
    }
  )

}
function buildLibrary(){

  $.getJSON(s_textureJSON, function (data){
    getAnimationsAndSkins(data);
    setAnimationsAndSkinsActions();

  })


}
function setAnimationsAndSkinsActions()
{
  console.log('hum');
  $.each($('.animations-list .list-group a'), function(i){
    console.log('#anim_',i,$(this));
    $(this).mousedown(function(){
      anSk.setAnimation(0,String(AnimationsList[i]), true);
      currentAnimation = String(AnimationsList[i]);
      logIt('set current animation: '+currentAnimation);
    })
  });

  $.each($('.skins-list .list-group a'), function(j){
    console.log('#skin_',j,$(this));
    $(this).mousedown(function(){
      console.log(String(SkinsList[j]));
      //MyScene.removeChild(anSk);
      var p = anSk.parent;
      anSk.removeFromParent(false);
      //anSk.
      anSk.updateWorldTransform();
      anSk.setSkin(String(SkinsList[j]));
      currentSkin = String(SkinsList[j]);
      logIt('set current skin: '+currentSkin);
      p.addChild(anSk);
      anSk.update(200);
    })
  });
}
function getAnimationsAndSkins(data)
{
  console.log('construct htmlBloc .. ');
  var newAnHtml = '<div class="list-group">';
  var newSkHtml = '<div class="list-group">';
  console.log(data);
  /*Animations*/
  var an = AnimationsList = Object.keys(data.animations);
  for (var i = 0; i < an.length; i++) {
    console.log('..adding ', an[i]);
    newAnHtml += '<a href="#" class="list-group-item" id="anim_'+i+'"><img src="icons/dot_grey.png"></img> '+ String(an[i]) +'</a>';
  }
  newAnHtml += "</div>";
  console.log('yo',newAnHtml);
  $('#animations-list').html(newAnHtml);

  /*Skins*/
  var sk = SkinsList = Object.keys(data.skins);
  for (var i = 0; i < sk.length; i++) {
    console.log('..adding ', sk[i]);
    newSkHtml += '<a href="#" class="list-group-item" id="skin_'+i+'><img src="icons/dot_grey.png"></img> '+ String(sk[i]) +'</a>';
  }
  newSkHtml += "</div>";
  console.log('yo',newSkHtml);
  $('#skins-list').html(newSkHtml);
}
