/**
Globals
*/

function lookupNames(){
  var articleTags = document.getElementsByTagName('article');
  if (articleTags.length > 0){

    // Le Temps
    var p_list = articleTags[0].querySelectorAll('.article-content p');
    var count0 = 0;
    var count = 0;

    for(i in p_list){
      if(p_list[i].innerHTML){
        count0++;
        var innerHTML = p_list[i].innerHTML;
        if(innerHTML.indexOf('Pierre Maudet') >= 0){
          p_list[i].innerHTML = innerHTML.replace('Pierre Maudet', '<span class="modal-available" data-who="pierre-maudet">Pierre Maudet</span>');
          count++;
        }
      }
    }
  }

  setTimeout(function(){
    ['mouseover', 'click'].forEach(function(e) {
      var spanElements = document.querySelectorAll('span.modal-available');
      if(spanElements.length > 0){
        for(i in spanElements){
          spanElements[i].addEventListener(e, eventHandler);
        }
      }
    });
  }, 200);

}

lookupNames();

function eventHandler(e){
  alert('Event!');
}



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
