var popupLoaded = false;

function translateValue(elementId, messageName) {
 document.getElementById(elementId).value = chrome.i18n.getMessage(messageName);
}
function translateText(elementId, messageName){
 document.getElementById(elementId).innerText = chrome.i18n.getMessage(messageName);
}

document.addEventListener('DOMContentLoaded', () => {
  // i18n
  if(chrome.i18n.getMessage('currentLocale') == 'de' && !popupLoaded){
    translateText('popupHeader', 'popupHeader');
    translateText('popupInfoLine1', 'popupInfoLine1');
    translateText('popupInfoLine2', 'popupInfoLine2');
    translateText('popupInfoLine3', 'popupInfoLine3');

    var divs = document.querySelectorAll('.popupInfoMore'), i;
    for (i = 0; i < divs.length; ++i) {
      divs[i].style.display = "none";
    }
    document.getElementById('header').innerText = 'fuck';
  }

  popupLoaded = true;

});
