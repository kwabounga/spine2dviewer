//#loader-buttons

//$('#loader-buttons')

//var currentSkeleton = "runner";
var allSkeletons = [];

$.ajax({
  url: "animations/",
  success: function(data){
     $(data).find("a:contains(.png)").each(function(){
        // will loop through
        var fullName = $(this).attr("href");
        var skName = fullName.split(".")[0];
        console.log("Found a Skeleton: " + skName);
        allSkeletons.push(skName);
     });
     console.log("allSkeletons", allSkeletons);
     constructAnimationDropDownButton(allSkeletons);
  }
});

function constructAnimationDropDownButton(skeletons)
{
  var htmlDropDown = '';
  if(!skeletons)return;
  $(skeletons).each( function(i){
      htmlDropDown +=  '<li><a href="#">'+ allSkeletons[i] + '</a></li>'
      ;
  });
  $('#loader-buttons').html(htmlDropDown);

  $("#loader-buttons li a").each( function(i){
    $(this).mousedown(function(){
        currentSkeleton = allSkeletons[i];
        logIt('want to load: ' + currentSkeleton);
        killviewport(currentSkeleton);
    });
  });
}
