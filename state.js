/*
clicked (every element clicked is recorded as such)
on (every element clicked is marked as on)
active (only 1 child can be active)
current (the very last element that been clicked)
inview (currently in viewport)
seen (was previously or is currently in viewport)
*/
;
(function() {
    "use strict";
    var state = {
        add: function(el, str) {
            if (!!el.dataset.state) {
                var states = el.dataset.state.split(' ');
                var index = states.indexOf(str); //IE >=9
                if (index < 0) {
                    states.push(str);
                }
                el.dataset.state = states.join(' ');
            } else {
                el.dataset.state = str;
            }
        },
        remove: function(el, str) {
            if (!!el.dataset && !!el.dataset.state) {
                var states = el.dataset.state.split(' ');
                var index = states.indexOf(str); //IE >=9
                if (index > -1) {
                    states.splice(index, 1);
                }
                el.dataset.state = states.join(' ');
            }
        },
        toggle: function(el, str) {
            if (state.is(el, str)) {
                state.remove(el, str);
            } else {
                state.add(el, str);
            }
        },
        replace: function(el, oldstr, newstr) {
            if (state.is(el, oldstr)) {
                state.remove(el, oldstr);
                state.add(el, newstr);
            }
        },
        is: function(el, str) {
            if (!!el && !!el.dataset && !!el.dataset.state) {
                var states = el.dataset.state.split(' ');
                var index = states.indexOf(str); //IE >=9
                if (index > -1) {
                    return true
                }
            }
            return false;
        },
        onclick: function(e) {
            //console.log(e.target,e.currentTarget);
            var start = performance.now();  
            //mark the element as 'clicked':
            state.add(e.target, "clicked");
            //toggle the 'on' state
            state.toggle(e.target, "on");
            //set the clicked child as 'active' and remove 'active' from the other children (only 1 child can be 'active'):
            var children = e.target.parentNode.childNodes,
              n = children.length;
            //console.log("-",n);
            while (n--) {
                //console.log("n",n);
                //state.remove(children[n], "active");
                state.remove(children[n], "previous");
                state.replace(children[n], "active", "previous");
            }
            state.add(e.target, "active");
            //set as 'current' and remove from elsewhere in the dom (only 1 element in the whole dom can be 'current')
            var current = document.querySelectorAll('*[data-state~="current"]'),
                i = current.length;
                //console.log(i);
            while (i--) {
            //console.log("i",i);
                state.remove(current[i], "current");
            }
            state.add(e.target, "current");

            //
            console.log(e.target, (performance.now() - start));
        },
        onscroll: function(e) {
            var clientHeight = (window.innerHeight || document.documentElement.clientHeight),
                clientWidth = (window.innerWidth || document.documentElement.clientWidth);
            var isElementInViewport = function(el) {
                var rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= clientHeight &&
                    rect.right <= clientWidth
                );
            };
            var el = document,
                all = el.getElementsByTagName("*"),
                n = all.length;
                //console.log("nnn",n);
            while (n--) {
                //console.log(n);
                state.replace(all[n], "inview", "seen");
                if (isElementInViewport(all[n])) {
                    state.add(all[n], "inview");
                }
            }
        }
    };
    var scrollTimer = null;
    var resizeTimer = null;
    document.addEventListener("click", state.onclick, false); //a click. dont bubble
    document.addEventListener("focus", state.onclick, false); //for tabbing? dont bubble
    document.addEventListener("touchend", state.onclick, false); //a tap. dont bubble
    document.addEventListener("scroll", function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(state.onscroll, 25);
    }, false); //debounced scroll event
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(state.onscroll, 250);
    }, false); //debounced resize event
    //initial state
    state.onscroll.call(document);
}());