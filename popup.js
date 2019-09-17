function log(obj){
  // toggle for debug
  // console.log(obj);
}

var popupLoaded = false;

function translateValue(elementId, messageName) {
 document.getElementById(elementId).value = chrome.i18n.getMessage(messageName);
}
function translateText(elementId, messageName){
 document.getElementById(elementId).innerText = chrome.i18n.getMessage(messageName);
}

document.addEventListener('DOMContentLoaded', () => {
  // i18n
  // translateText('header', 'header');
  // translateText('instructions', 'instructions');
  //
  // if(navigator.appVersion.indexOf("Mac") != -1){
  //   // label for mac with "cmd" character
  //   translateText('shortcutsLabel', 'shortcutsLabelMac');
  //   translateText('extensionShortcutLabel', 'extensionShortcutLabelMac')
  // }else{
  //   translateText('shortcutsLabel', 'shortcutsLabel');
  //   translateText('extensionShortcutLabel', 'extensionShortcutLabel')
  // }

  popupLoaded = true;

});
