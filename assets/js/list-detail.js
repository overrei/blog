 hljs.initHighlightingOnLoad();
 var footTools = document.querySelector('#footTools');

 window.onscroll = function() {
     var t = document.documentElement.scrollTop || document.body.scrollTop;
     if (t != 0) {
         footTools.classList.add('active');
     } else {
         footTools.classList.remove('active');
     }
 }


 var addEve = function(dom, eveName, callback, flag) {
     if (dom.addEventListener) {
         dom.addEventListener(eveName, callback, flag || false);
     } else if (dom.attachEvent) {
         dom.attachEvent("on" + eveName, callback, flag || false);
     } else {
         dom["on" + eveName] = callback;
     }
 }

 var hasClass = function(dom, cls) {
     cls = cls || '';
     if (cls.replace(/\s/g, '').length == 0) return false;
     return new RegExp(' ' + cls + ' ').test(' ' + dom.className + ' ');
 }

 //滚动条函数封装
 var scroll_To = function(tar_y) { //tar_y 即滑动条顶端 距离页面最上面的距离
     //console.log('oooooooo')
     var timer = setTimeout(function() {
         var current_y = document.body.scrollTop,
             //console.log(current_y)
             step = 20; //步长系数 即剩余的距离除以40 每1ms 移动一段距离
         if (tar_y > current_y) { //tar_y > current_y 即向下滚动
             var dist = Math.ceil((tar_y - current_y) / step);
             var next_y = current_y + dist;
             if (next_y < tar_y) { //向上滚动和向下滚动判定的区别 是这里！！
                 window.scrollTo(0, next_y);
                 scroll_To(tar_y);
                 //console.log('向下')
             } else {
                 window.scrollTo(0, tar_y)
                     //clearTimeout(timer)
             }
         } else { //tar_y < current_y 即向上滚动
             var dist = Math.floor((tar_y - current_y) / step);
             var next_y = current_y + dist;
             if (next_y > tar_y) {
                 window.scrollTo(0, next_y);
                 scroll_To(tar_y);
                 //console.log('向上')
             } else {
                 window.scrollTo(0, tar_y);
                 clearInterval(timer)
             }
         }
     }, 1)
 }

 var listDetailClose = function(){
    if(!window.parent.window.index)return;
    window.parent.window.index.listDetailClose();
 }

 addEve(footTools, "click", function(e) {
     if (hasClass(this, "active") && 　window.scrollTo != 0) {
         this.classList.add('animate');
         window.scroll_To(0);
     }
 });