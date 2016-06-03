/** infos skeleton **/
var currentSkeleton = "runner";
var currentAnimation = 'run';
var currentSkin = 'default';
var currentScale = 1;

/** variables for loading skeletons **/
var dirData = "animations/";

var s_texture = dirData + currentSkeleton + ".png";
var s_textureJSON = dirData + currentSkeleton + ".json";
var s_textureATLAS = dirData + currentSkeleton + ".atlas";

/** cocos2d scene **/
var MyScene;

/** spine Skeleton Animation **/
var anSk;




window.onload = function(){initviewPort();};

/** Kill viewer, reinit skeleton infos, restart viewport **/
function killviewport(newSkeleton)
{
	console.log(newSkeleton);
	if(newSkeleton)currentSkeleton = newSkeleton;
	s_texture = dirData + currentSkeleton + ".png";
	s_textureJSON = dirData + currentSkeleton + ".json";
	s_textureATLAS = dirData + currentSkeleton + ".atlas";
	currentSkin = 'default';
	cc.game.end();
	initviewPort();
}
/** init viewport and start animation**/
function initviewPort()
{
	//build library and set currentSkeleton
	buildLibrary();
	console.log(s_texture,s_textureATLAS,s_textureJSON);
	//add handler on Start Event
  cc.game.onStart = function(){
		//load texture, atlas, and json animation informations and add handler on success
    cc.LoaderScene.preload([s_texture, s_textureATLAS, s_textureJSON], function () {handleLoader();},this);
		//show or not Statistics / fps etc...
		cc.director.setDisplayStats(false);
  };
	//start rendering viewport
  cc.game.run("viewport-canvas");
};
/**cc.LoaderScene preload handler**/
function handleLoader()
{
	//init Cocos2d Scene
    MyScene = cc.Scene.extend({
				onEnter:function () {
						// must execute onEnter.super()
            this._super();
						// get windows size
            var size = cc.director.getWinSize();
						//create AnimationSkeleton (anSk)
						anSk = new sp.SkeletonAnimation(s_textureJSON,s_textureATLAS,1);
						//place anSk
            anSk.setPosition(size.width / 2, 0 );
						//validate tranformation
            anSk.updateWorldTransform();

            //set current Skin
            anSk.setSkin(currentSkin);
						//Set Listeners states Animation Timeline Events
            anSk.setAnimationListener(this, this.animationStateEvent);
						//Set the current animation
            anSk.setAnimation(0,currentAnimation, true);

            //anSk.setAnimation(0,"walk",true); // lance l'animation d'origine
            //anSk.addAnimation(0,"shoot",true, 2); // ce met a tirer au bout de 2loops
            //anSk.addAnimation(0,"stand",true, 3); // ce met en stand by au bout de 3loops
            //anSk.addAnimation(0,"walk",true,2); // reprend la marche apres 2loops
            //anSk.addAnimation(0,"stand",true,2);

						//Define Time Speed Animation
            anSk.setTimeScale(1.5);

						//Listening states Animation Timeline Events
            /*anSk.state.onEvent = function (trackIndex, event) {
        			cc.log(trackIndex + " event: " + event.data.name)
        		}*/

						//Add Animation Skeleton on cocos2d "MyScene"
            this.addChild(anSk);
						// Set Skeleton Animation Size
						var goodheight = 650;
						if (anSk.height>goodheight){
							var newscale = ((anSk.height-goodheight)/goodheight * 100)/100;
							currentScale = newscale;
							anSk.scaleX = anSk.scaleY = newscale;
							anSk.updateWorldTransform();
						}

						//Mouse Events Listener
            cc.eventManager.addListener({
              event: cc.EventListener.MOUSE,
              onMouseDown: function(event){
								launchRandomAnimation(event);
							}
            }, this);
						/*cc.eventManager.addListener({
							event: cc.EventListener.TOUCH_ONE_BY_ONE,
							onTouch: function(event) {
								logIt('touch');
								console.log('touch' , event);
							}
            },this);*/
						//Touch Event Listener
						cc.eventManager.addListener({
	            event: cc.EventListener.TOUCH_ONE_BY_ONE,
	            onTouchBegan : function(event){
								launchRandomAnimation(event);
							}
        		}, this);
						//change canvas size
						resetCanvasSize();
						//add controls interface
            addControls();

          }
    });
	//Run Cocos Scene
  cc.director.runScene(new MyScene());

}

// choose and Random animation, mix with current one, and launch it
function launchRandomAnimation(event)
{
	if(AnimationsList)
	{
		var idRan = Math.round(Math.random()*(AnimationsList.length-1));
	}else{
		console.log('clic FAIL to get Animation ID: no AnimationsList');
	}


	anSk.setMix(String(AnimationsList[idRan]), currentAnimation, 1);
	anSk.setMix(currentAnimation, String(AnimationsList[idRan]), 1);

	anSk.setAnimation(0, String(AnimationsList[idRan]), true); //ce met a faire l'action directement
	anSk.addAnimation(0, currentAnimation, true, 2); //reprend la marche apres 3loops
}
