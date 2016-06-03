// array to push Skeletons names
var allSkeletons = [];


//Get Alls Skeletons from server folder
$.ajax({
  url: "animations/",
  success: function(data){
     $(data).find("a:contains(.png)").each(function(){
       //Get full name
        var fullName = $(this).attr("href");
        //remove the extention
        var skName = fullName.split(".")[0];
        console.log("Found a Skeleton: " + skName);
        //add in Array
        allSkeletons.push(skName);
     });

     console.log("allSkeletons", allSkeletons);
     // Build Dropdown menu from skeleton Array
     constructAnimationDropDownButton(allSkeletons);
  },
  error: function(data){
    //Fix for GitHub Serveur -_-
    console.log('error', data);
    //hand's write array Skeleton
    allSkeletons = ["boss_01", "raptor", "robot_gun_walk", "runner"];
    // Build Dropdown menu from skeleton Array
    constructAnimationDropDownButton(allSkeletons);
  }

});

function constructAnimationDropDownButton(skeletons)
{
  var htmlDropDown = '';
  if(!skeletons)return;

  $(skeletons).each( function(i){

      htmlDropDown +=  '<li><a href="#">'+ allSkeletons[i] + '</a></li>';
  });
  $('#loader-buttons').html(htmlDropDown);

  $("#loader-buttons li a").each( function(i){

    $(this).mousedown(function(){

        logIt('loading: ' + allSkeletons[i]);
        killviewport(allSkeletons[i]);
    });
  });
}
