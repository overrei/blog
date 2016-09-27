var $indexLeftNav = $(".index-left-nav");
var $navBtn = $("#navBtn");
var $navList = $(".navList");
var $list = $navList.find(".nav-list");
var $indexContentList = $("#index-content-list");
var $mask = $("#mask");


$navBtn.on("click", function() {
    $navBtn.hasClass("active") ? closeNav() : openNav();
});

$list.on("click", function() {
    var $that = $(this);
    $that.hasClass("active") ? closeContentList($that) : openContentList($that);
});

$list.on("mouseenter", function() {
    var text = this.getAttribute("hover-text");
    if (text != undefined && text != "") {
        $("<span>").addClass("hover-text").text(text).appendTo($(this));
    }
    return false;
});

$list.on("mouseleave", function() {
    $(this).children(".hover-text").remove();
    return false;
});

var openNav = function() {

    $indexLeftNav.addClass("active");
    $navBtn.addClass("active");
    $navList.show();

}
var closeNavCallback = function() {
    $indexLeftNav.removeClass("active");
    $navBtn.removeClass("active");
    $navList.hide();
}

var closeNav = function() {
    if ($indexContentList.hasClass("active")) {
        closeContentList(undefined, closeNavCallback);
    } else {
        closeNavCallback();
    }

}

var openContentList = function(jqdom) {
    var iframeId = jqdom.attr("type");
    var iframeSrc = jqdom.attr("data-href");
    var $indexIframe = $(".index-iframe[iframe-id='" + iframeId + "']");
    $list.removeClass("active");
    jqdom.addClass("active");
    $mask.addClass("active");
    $indexContentList.show(0, function() {
        $indexContentList.addClass("active");
    });
    $(".content-list").removeClass("open");
    $(".index-iframe").removeClass("open");
    if ($indexIframe.length === 0) {
        $indexIframe = $("<iframe>").addClass("index-iframe").attr("iframe-id", iframeId);
    }

    if (_isNull($indexIframe.attr("src"))) {

        $indexIframe.attr("src", iframeSrc).appendTo($indexContentList);
        _onloadIframe($indexIframe[0], function() {
            $indexIframe.addClass("open");
            $mask.removeClass("active");
            openListAni(this);
        });
    } else {
        $indexIframe.addClass("open");
        $mask.removeClass("active");
    }
}

var closeContentList = function(jqdom, callback) {
    $list.removeClass("active");
    $indexContentList.fadeOut(300, function() {
        $indexContentList.removeClass("active");
        typeof callback === "function" ? callback() : false;
    })
}

var _isNull = function(arg) {
    return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false;
}

var _onloadIframe = function(iframe, callback) {
    if (iframe.addEventListener) {
        iframe.addEventListener("load", callback, false);
    } else if (iframe.attachEvent) {
        iframe.attachEvent("onload", callback, false);
    } else {
        iframe["onload"] = callback;
    }
}

var openListAni = function(dom) {
    if (dom.contentWindow.openAni) dom.contentWindow.openAni();
}