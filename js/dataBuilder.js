var AnimationsList;
var SkinsList;

function buildLibrary() {
  $.getJSON(s_textureJSON, function(data) {
    getAnimationsAndSkins(data);
    setAnimationsAndSkinsActions();
  })
}

function setAnimationsAndSkinsActions() {
  debug('setAnimationsAndSkinsActions');
  $.each($('.framed[title="Animations"] ul li'), function(i) {

    $(this).mousedown(function() {
      currentAnimation = String(AnimationsList[i]);
      anim_index = i;
      updateAnim();
      alerter('set current animation: ' + currentAnimation, 'good');
    })
  });
  currentAnimation = AnimationsList[0];
  $.each($('.framed[title="skins"] ul li'), function(j) {

    $(this).mousedown(function() {

      debug(String(SkinsList[j]));
      currentSkin = String(SkinsList[j]);
      skin_index = j;
      updateSkin();
      debug('set current skin: ' + currentSkin);
    })
  });

  console.log(SkinsList.length, 'SkinsList.length ');
  if (SkinsList.length > 1) {
    currentSkin = SkinsList[1];
  } else {
    currentSkin = SkinsList[0];
  }
}

function getAnimationsAndSkins(data) {
  console.log('construct htmlBloc .. ');
  var menuAnim = $(".framed[title='Animations'] .list");
  $(menuAnim).html("");
  var newMenu = document.createElement('ul');
  var an = AnimationsList = Object.keys(data.animations);

  for (var i = 0; i < an.length; i++) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(String(an[i])));
    $(li).addClass('anim');
    newMenu.appendChild(li);
  }

  $(menuAnim).html(newMenu);

  // /*Skins*/
  var menuSkins = $(".framed[title='skins'] .list");
  $(menuSkins).html("");
  var newMenuSk = document.createElement('ul');
  var sk = SkinsList = Object.keys(data.skins);

  for (var i = 0; i < sk.length; i++) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(String(sk[i])));
    $(li).addClass('skin');
    newMenuSk.appendChild(li);
  }
  $(menuSkins).html(newMenuSk);
}
