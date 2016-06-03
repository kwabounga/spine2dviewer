var dirData = "animations/";
var test ="icons/center.png";
//var s_texture = dirData + "boss_01.png";
//var s_textureJSON = dirData + "boss_01.json";
//var s_textureATLAS = dirData + "boss_01.atlas";

//var s_texture = dirData + "runner.png";
//var s_textureJSON = dirData + "runner.json";
//var s_textureATLAS = dirData + "runner.atlas";

var s_texture = dirData + "robot_gun_walk.png";
var s_textureJSON = dirData + "robot_gun_walk.json";
var s_textureATLAS = dirData + "robot_gun_walk.atlas";

var g_mainmenu = [
	{type:"IMAGE", src:s_texture},
	{type:"XML", src:s_textureJSON},
	{type:"TEXT", src:s_textureATLAS},
];

var MyScene;
var anSk;

window.onload = function(){init();};


function init()
{
  cc.game.onStart = function(){
    cc.LoaderScene.preload([test,s_texture, s_textureATLAS, s_textureJSON], function () {handleLoader();},this);
  };
  cc.game.run("viewport-canvas");
};

function handleLoader()
{
    MyScene = cc.Scene.extend({
        onEnter:function () {
            this._super();
            var size = cc.director.getWinSize();
            var sprite = cc.Sprite.create(test);
            sprite.setPosition(size.width / 2, size.height / 2);
            sprite.setScale(0.8);
            //sprite.opacity = 150;
						console.log('>>>>>>>',this);
            this.addChild(sprite, 0);

            //var label = cc.LabelTTF.create("Hello World", "Arial", 40);
            //label.setPosition(size.width / 2, size.height / 2);
            //this.addChild(label, 1);

            anSk = new sp.SkeletonAnimation(s_textureJSON,s_textureATLAS,0.4);
            anSk.setPosition(size.width / 2, 0 );
            anSk.updateWorldTransform();

            //anSk.setSkin("bombshell");
            anSk.setSkin("batman");

            //anSk.setMix("walk","shoot",0.5);
            //anSk.setMix("shoot","walk",0.5);
            //anSk.setMix("shoot","stand",0.5);
            //anSk.setMix("stand","walk",0.5);
            //anSk.setMix("walk","stand",0.5);
            //anSk.setMix("stand","walk",0.5);
            anSk.setAnimationListener(this, this.animationStateEvent);

            anSk.setAnimation(0,"run", true);

            //anSk.setAnimation(0,"walk",true); // lance l'animation d'origine
            //anSk.addAnimation(0,"shoot",true, 2); // ce met a tirer au bout de 2loops
            //anSk.addAnimation(0,"stand",true, 3); // ce met en stand by au bout de 3loops
            //anSk.addAnimation(0,"walk",true,2); // reprend la marche apres 2loops
            //anSk.addAnimation(0,"stand",true,2);

            anSk.setTimeScale(1.5);

            /*anSk.state.onEvent = function (trackIndex, event) {
        			cc.log(trackIndex + " event: " + event.data.name)
        		}*/
            this.addChild(anSk);
            //var speed = cc.Speed(anSk, 0.5);
            cc.eventManager.addListener({
              event: cc.EventListener.MOUSE,
              onMouseDown: function(event) {
                cc.log('shoot');
                console.log('shoot');
            		anSk.setAnimation(0, "shoot", true); //ce met a faire l'action directement
            		anSk.addAnimation(0, "walk", true, 3); //reprend la marche apres 3loops
              }
            },this);
            addControls();
          }
    });
  cc.director.runScene(new MyScene());

}
