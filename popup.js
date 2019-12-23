var popupLoaded = false;

function translateValue(elementId, messageName) {
 document.getElementById(elementId).value = chrome.i18n.getMessage(messageName);
}
function translateText(elementId, messageName){
 document.getElementById(elementId).innerText = chrome.i18n.getMessage(messageName);
}

function getLang(){
  var storedLang = localStorage.getItem('parliamentarian-lang');
  if( storedLang ){
    return storedLang;
  } else {
    return chrome.i18n.getMessage('currentLocale');
  }
}

function setLang(lang){
  localStorage.setItem('parliamentarians-lang', lang);
  setTimeout(function(){
    document.getElementById('langTick').style.display = 'inline-block';
  }, 300);
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
  }


  // not in use yet
  /*
  document.getElementById( 'option-' + getLang() ).selected = true;

  document.querySelector('#langSelect').addEventListener('input', function(){
    document.getElementById('langTick').style.display = 'none';
    console.log('Change language to: ' + this.value);
    setLang(this.value);
  });
  */

  popupLoaded = true;

});
