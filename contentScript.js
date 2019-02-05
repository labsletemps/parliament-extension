/**
 Globals
*/



function lookupNames(){
  p_list = document.querySelectorAll('p');
  for(i in p_list){
    if(p_list.innerHTML){
      p_list[i].innerHTML = p_list[i].innerHTML.replace('Pierre Maudet', '<b class="modal-available">Pierre Maudet</b>');      
    }
  }
}
lookupNames();

function log(obj){
  // toggle for debug
  // console.log(obj);
}

// To prevent an error when the extension loads at first.
// We use “var” instead of “let” so it may be overwritten.
chrome.storage.local.get({
 noShortcut: false
}, function(items){
  noShortcut = items.noShortcut;

 if(noShortcut){
   shortcutsOn = false;
 }
});

if (typeof shortcutsOn == 'undefined') {
  var shortcutsOn = true;
}
