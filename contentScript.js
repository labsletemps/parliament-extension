/**
 Globals
*/



function lookupNames(){
  var articleTags = document.getElementsByTagName('article')
  if (articleTags.length > 0){
    // Le Temps
    p_list = articleTags[0].querySelectorAll('.article-content p');
    for(i in p_list){
      if(p_list[i].textContent.indexOf('Maudet') >= 0){
        p_list[i].style.color = '#f00';
      }
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
