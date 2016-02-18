/*
clicked (every element clicked is recorded as such) 
on (every element clicked is marked as on) 
active (only 1 child can be active)
current (the very last element that been clicked)
*/
var state = {
  add: function (el, str) {
    if (!!el.dataset.state) {
      state.remove(el, str);
      el.dataset.state = el.dataset.state+" "+str;
    } else {
      el.dataset.state = str;
    }
  },
  remove: function (el, str) {
    if (!!el.dataset && !!el.dataset.state) {     
      var re = new RegExp(str,"g");
      el.dataset.state = el.dataset.state.replace(re,"");
    }
  },
  toggle: function (el, str) {
    if (state.is(el, str)) {
      state.remove(el, str);
    } else {
      state.add(el, str);
    }
  },
  replace: function (el, oldstr, newstr) {
    if (state.is(el, oldstr)) {
      state.remove(el, oldstr);
      state.add(el, newstr);
    }
  },
  is: function (el, str) {
    if (!!el.dataset && !!el.dataset.state) {
      //TODO consider a regex here (it might be faster)
      var states = el.dataset.state.split(' ');
      var index = states.indexOf(str); //IE >=9
      if (index > -1) {
        return true
      }
    }
    return false;
  },
  onclick: function (e) {
    //console.log(e.target,e.currentTarget);
    //clicked (every element clicked is recorded as such) 
    state.add(e.target, "clicked");
    //on (every element clicked is marked as on) 
    state.toggle(e.target, "on");
    //active (only 1 child can be active);
    var children = e.target.parentNode.childNodes;
    var n = children.length - 1;
    while (n--) {
      console.log(children[n]);
      state.remove(children[n], "previous");
      state.replace(children[n], "active", "previous");
    }
    state.add(e.target, "active");
    //current (the very last element that been clicked)
    var current = document.querySelectorAll('*[data-state~="current"]'),
      i;
    for (i = 0; i < current.length; ++i) {
      state.remove(current[i], "current");
    }
    state.add(e.target, "current");
    
    //
  }
}
document.addEventListener("click", state.onclick, false);
document.addEventListener("focus", state.onclick, false);

/* perf test */
if(0>1){
var start = performance.now();
for(i=0; i<1000; i++){ 
    
    var str = 'omega iota kappa';
/*
    var items = str.split(' ');
    var index = items.indexOf("omega"); //IE >=9
    if (index > -1) {items.splice(index, 1);}
    items.join(' ');
  //SLOWEST 5.5 */

 str.replace(/omega/g,''); //FASTEST 1.5
   
}
console.log(performance.now() - start);
}