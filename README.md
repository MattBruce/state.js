# State.js
State.js is a tiny script which maintains the UI state of your html elements so that their state-dependent presentation can be controlled with CSS alone.

Most common behaviours on a HTML site can be done in CSS. This is often more flexible and performant. Commonly, a site would include jQuery or other libraries for performing slide-out/reveals toggles, active states, carousels, sliders etc. With State JS all this work can be moved to the CSS file. 

State.js simply adds a data-attribute to all elements and listens for touch and click events. On click, an element will get the data-state of 'clicked' plus the data-state 'on' is toggled. Just a few 'states' gives us enough information to create carousels, accordions, tabbed areas, sliders, etc *without* the need for further JS.

clicked (set on click)  
on (toggled on click)  
active (set on click, removed on click of sibling. Only 1 child sibling in each family can be active)  
previous (set on click of sibling. Applied to the last active child sibling in each family)  
current (the very last element in the whole dom that been clicked) 

https://jsfiddle.net/moob/a8pdmq7f/
