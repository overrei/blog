function Index() {
    this.$indexLeftNav = $(".index-left-nav");
    this.$navBtn = $("#navBtn");
    this.$navList = $(".navList");
    this.$list = this.$navList.find(".nav-list");
    this.$indexContentList = $("#index-content-list");
    this.$mask = $("#mask");
    //路由
    this.routes = {};
    this.routeHtml = {
        '/':""
    };
    this.currentUrl = '';
    //路由列表
    this.routeList = ['/', '/css','/canvas','/javaScript','/nodeJs','/gulp','/requireJs','/other'];
    //路由缓存页面
    this.routeHtmlList=['', 'cssList.html','canvasList.html','javaScriptList.html','nodeJsList.html','gulpList.html','requireJsList.html','otherList.html'];
    this.routeHtmlCache={};
    var index = this;
}

Index.prototype = {
    openNav: function(callback) {
        index.$indexLeftNav.addClass("active");
        index.$navBtn.addClass("active");
        index.$navList.show(function(){
           if(typeof callback === "function")callback();
        });
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
    //打开左侧菜单，并缓存页面
    // openContentList: function(jqdom) {
    //     var iframeId = jqdom.attr("type");
    //     var iframeSrc = jqdom.attr("data-href");
    //     var $indexIframe = $(".index-iframe[iframe-id='" + iframeId + "']");  
    //     index.$list.removeClass("active");
    //     jqdom.addClass("active");
    //     index.$mask.addClass("active");
    //     index.$indexContentList.show(0, function() {
    //         index.$indexContentList.addClass("active");
    //     });
    //     $(".content-list").removeClass("open");
    //     $(".index-iframe").removeClass("open");
    //     if ($indexIframe.length === 0) {
    //         $indexIframe = $("<iframe>").addClass("index-iframe").attr("iframe-id", iframeId);
    //     }

    //     if (index._isNull($indexIframe.attr("src"))) {

    //         $indexIframe.attr("src", iframeSrc).appendTo(index.$indexContentList);
    //         index._onloadIframe($indexIframe[0], function() {
    //             $indexIframe.addClass("open");
    //             index.$mask.removeClass("active");
    //             index.openListAni(this);
    //         });
    //     } else {
    //         $indexIframe.addClass("open");
    //         index.$mask.removeClass("active");
    //     }
    //     return index;
    // },
    //关闭详情页面
    listDetailClose:function(){
        var $listDetailIframe = index.$indexContentList.children("#list-detail");
        $listDetailIframe.removeClass("active");
        index.$indexContentList.children(".index-iframe").css("visibility","visible");
    },
    //关闭菜单对应的缓存页面
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
    //绑定各种事件
    bindEvent: function() {
        //左侧菜单事件
        // index.$list.on("click", function() { 
        //     var $that = $(this);
        //     $that.hasClass("active") ? index.closeContentList($that) : index.openContentList2($that);
        // });
        
        //详情页面的点击事件
        index.$indexContentList.on("click",".list-box>a",function(e){
            var src = this.getAttribute("data-href");
            var $listDetailIframe = index.$indexContentList.children("#list-detail");
            index.$indexContentList.children(".index-iframe").css("visibility","hidden");
            index.$indexContentList.children("#mask").addClass("active");
            if($listDetailIframe.length === 0){
                $listDetailIframe = $("<iframe id='list-detail' class='list-detail'>");
                $listDetailIframe.appendTo(index.$indexContentList);
            } 
            setTimeout(function(){
                $listDetailIframe.attr("src", src);
                $listDetailIframe.on("load",function(){
                    $listDetailIframe.addClass("active");
                    index.$indexContentList.children("#mask").removeClass("active");
                });
            },500);
            
            e.stopPropagation();
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
    //监听路由
    routeListenin:function(path, callback){
        index.routes[path] = callback || function() {}; //给不同的hash设置不同的回调函数
    },
    //缓存路由html
    routeHtmlListListenin:function(path, url){
        index.routeHtml[path] = url || ""; //给不同的hash设缓存不同的html路径
    },
    //刷新路由
    routeRefresh:function(){
        index.currentUrl = location.hash.slice(1) || '/'; //如果存在hash值则获取到，否则设置hash值为/
        index.routes[index.currentUrl](index.currentUrl); //根据当前的hash值来调用相对应的回调函数
    },
    //打开左侧菜单，并缓存页面,通过路由的方式
    openContentList2:function(jqdom){
        var url = location.hash.replace('#','');
        if(index.$indexContentList.children("#list-detail").hasClass("active")){
            index.listDetailClose();
        }
        if(url === ''){
           return;
        }
        if(!index.routes[url]){
            url = "notfound";
        }
        if(!index.routeHtmlCache[url]){
            //如果没有缓存当前需要的页面
            index.routeRequest(index.routeHtml[url], 'GET', '',function(status, page){
                if(status == 404){
                    url = 'notfound';     
                    index.routeRequest(index.routeHtml[url],'GET','',function(status, page404){

                    });
                }
                else{
                    //缓存页面
                    index.routeHtmlCache[url] = page;
                    //读取缓存页面并插入dom
                    index.innerHTMLInCache(url, jqdom);            
                }
            });
        }else{
            //如果有所需页面的缓存,读取缓存页面并插入dom
            index.innerHTMLInCache(url, jqdom);       
        }
        
    },
    //读取缓存页面并插入dom
    innerHTMLInCache:function(url, jqdom){
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
        //如果当前要展示的页面没有在dom上
        if ($indexIframe.length === 0) {
            $indexIframe = $("<div>").addClass("index-iframe").attr("iframe-id", iframeId);
            $indexIframe.appendTo(index.$indexContentList)
            $indexIframe[0].innerHTML = index.routeHtmlCache[url]; 
           
        }
        $indexIframe.addClass("open");
        index.$mask.removeClass("active");

        // if (index._isNull($indexIframe.attr("src"))) {
        //     $indexIframe[0].innerHTML = index.routeHtmlCache[url]; 
        //     $indexIframe.attr("src", iframeSrc).appendTo(index.$indexContentList); 
            
        //         $indexIframe.addClass("open");
        //         index.$mask.removeClass("active");
             
        // } else {
        //     $indexIframe.addClass("open");
        //     index.$mask.removeClass("active");
        // }
    },
    //获取页面
    routeRequest:function(url, method, data, callback) {  
        //判断页面缓存是否存在
        if(index.routeHtml[url]){
            callback(200, index.routeHtml[url]);
        }
        else {
            var xmlhttp;
            if(window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
                xmlhttp.open(method, url, true);
                if(method === 'POST'){
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                }
                xmlhttp.send(data);
                xmlhttp.onreadystatechange = function(){
                    if(xmlhttp.readyState == 4){
                        switch(xmlhttp.status) {
                            //无效则404
                            case 404:                             
                                url = 'notfound';
                                break;
                            default:
                                var parts = url.split('.');
                                if(parts.length>1 && parts[parts.length-1] == 'html'){         
                                    index.routeHtml[url] = xmlhttp.responseText;  
                                }
                        }
                        callback(xmlhttp.status, xmlhttp.responseText);
                    }
                }
            }
            else{
                alert('抱歉！您的浏览器过于古老····')
                callback(404, {});
            }
        }
    },
    //初始化路由
    initRoute:function(){
        $(window).on('load', index.routeRefresh.bind(index))
                 .on('hashchange', index.routeRefresh.bind(index)); 
        //开始监听路由
        index.routeListenin(index.routeList[0], function(currentUrl) {
             return;
        });
        for(var i=1;i<index.routeList.length;i++){
            (function(i){ 
                index.routeListenin(index.routeList[i], function(currentUrl) {
                    index.openNav(function(){
                        index.openContentList2(index.$navList.children("a[href='#"+ index.routeList[i] +"']"));   
                    });
                });

                index.routeHtmlListListenin(index.routeList[i], index.routeHtmlList[i]);
            })(i);
            
        }
         
    },
    init: function() {
        index.bindEvent().initRoute();
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