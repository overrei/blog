var $indexLeftNav = $(".index-left-nav");
var $navBtn =$("#navBtn");
var $navList = $(".navList");
var $list = $navList.find(".nav-list");
var $indexContentList = $("#index-content-list");

$navBtn.on("click",function(){
	$navBtn.hasClass("active") ? closeNav() : openNav();
});

$list.on("click",function(){
	var $that = $(this);
	$that.hasClass("active") ? closeContentList($that) : openContentList($that);
});

$list.on("mouseenter",function(){
	var text = this.getAttribute("hover-text");
	if(text != undefined && text != ""){
		$("<span>").addClass("hover-text").text(text).appendTo($(this));
	}
	return false;
});

$list.on("mouseleave",function(){
	$(this).children(".hover-text").remove();
	return false;
});

var openNav = function(){
	
	$indexLeftNav.addClass("active"); 
	$navBtn.addClass("active");
	$navList.show();

}

var closeNav = function(){
	$indexLeftNav.removeClass("active"); 
	$navBtn.removeClass("active");
	$navList.hide();
	closeContentList();
}

var openContentList = function(jqdom){
	$list.removeClass("active");
	jqdom.addClass("active");
	$indexContentList.show(0,function(){
		$indexContentList.addClass("active");
	});
}

var closeContentList = function(jqdom){
	$list.removeClass("active");
	$indexContentList.removeClass("active");
	setTimeout(function(){
		$indexContentList.hide();
	},450);
}