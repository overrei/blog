function Index() {
    this.$indexLeftNav = $(".index-left-nav");
    this.$navBtn = $("#navBtn");
    this.$navList = $(".navList");
    this.$list = this.$navList.find(".nav-list");
    this.$indexContentList = $("#index-content-list");
    this.$mask = $("#mask");
    var index = this;
}

Index.prototype = {
    openNav: function() {
        index.$indexLeftNav.addClass("active");
        index.$navBtn.addClass("active");
        index.$navList.show();
        return index;
    },
    closeNavCallback: function() {
        index.$indexLeftNav.removeClass("active");
        index.$navBtn.removeClass("active");
        index.$navList.hide();
        return index;
    },
    closeNav: function() {
        if (index.$indexContentList.hasClass("active")) {
            index.closeContentList(undefined, index.closeNavCallback);
        } else {
            index.closeNavCallback();
        }
        return index;
    },
    openContentList: function(jqdom) {
        var iframeId = jqdom.attr("type");
        var iframeSrc = jqdom.attr("data-href");
        var $indexIframe = $(".index-iframe[iframe-id='" + iframeId + "']");
        index.$list.removeClass("active");
        jqdom.addClass("active");
        index.$mask.addClass("active");
        index.$indexContentList.show(0, function() {
            index.$indexContentList.addClass("active");
        });
        $(".content-list").removeClass("open");
        $(".index-iframe").removeClass("open");
        if ($indexIframe.length === 0) {
            $indexIframe = $("<iframe>").addClass("index-iframe").attr("iframe-id", iframeId);
        }

        if (index._isNull($indexIframe.attr("src"))) {

            $indexIframe.attr("src", iframeSrc).appendTo(index.$indexContentList);
            index._onloadIframe($indexIframe[0], function() {
                $indexIframe.addClass("open");
                index.$mask.removeClass("active");
                index.openListAni(this);
            });
        } else {
            $indexIframe.addClass("open");
            index.$mask.removeClass("active");
        }
        return index;
    },
    closeContentList: function(jqdom, callback) {

        index.$list.removeClass("active");
        index.$indexContentList.fadeOut(300, function() {
            index.$indexContentList.removeClass("active");
            typeof callback === "function" ? callback() : false;
        });
        return index;
    },
    _isNull: function(arg) {
        return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false;
    },
    _onloadIframe: function(iframe, callback) {
        if (iframe.addEventListener) {
            iframe.addEventListener("load", callback, false);
        } else if (iframe.attachEvent) {
            iframe.attachEvent("onload", callback, false);
        } else {
            iframe["onload"] = callback;
        }
    },
    openListAni: function(dom) {
        if (dom.contentWindow.openAni) dom.contentWindow.openAni();
        return this;
    },
    bindEvent: function() {

        index.$list.on("click", function() {
            var $that = $(this);
            $that.hasClass("active") ? index.closeContentList($that) : index.openContentList($that);
        });

        index.$list.on("mouseenter", function() {
            var text = this.getAttribute("hover-text");
            if (text != undefined && text != "") {
                $("<span>").addClass("hover-text").text(text).appendTo($(this));
            }
            return false;
        });

        index.$list.on("mouseleave", function() {
            $(this).children(".hover-text").remove();
            return false;
        });
        return index;
    },
    ifMobile: function() {
        return !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
    },
    initMobile: function() {
        index.$navBtn.on("touchend", function() {
            index.$navBtn.hasClass("active") ? index.closeNav() : index.openNav();
        });
        return this;
    },
    init: function() {
        index.bindEvent();
        if (!index.ifMobile()) {
            index.$navBtn.on("click", function() {
                index.$navBtn.hasClass("active") ? index.closeNav() : index.openNav();
            });
        } else {
            index.initMobile();
        }
        return index;
    }
}