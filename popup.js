/**
 * Invoke the script to bolden the characters.
 *
 * @param {string} method The method applied to select characters to bolden.
 */

function translateValue(elementId, messageName) {
 document.getElementById(elementId).value = chrome.i18n.getMessage(messageName);
}
function translateText(elementId, messageName){
 document.getElementById(elementId).innerText = chrome.i18n.getMessage(messageName);
}
function setShortcutAvailability(){
  console.log('Disabling shortcuts')
  // TODO clean this up
  if( document.getElementById('shortcuts').checked ){
    chrome.tabs.executeScript({
      code: 'var shortcutsOn = "false";'
    });
  }else{
    chrome.tabs.executeScript({
      code: 'var shortcutsOn = "false";'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('subtitles').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "subtitles";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });

  document.getElementById('interview').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "interview";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });

  document.getElementById('factsheet').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "factsheet";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });

  // Undo method
  document.getElementById('undo').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "undo";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });


  document.getElementById('shortcuts_p').addEventListener('click', () => {
    setShortcutAvailability();
  });

  // TODO maybe add the functions for quotes ("" to «»)

  // i18n
  translateValue("interview", "interviewButton");
  translateValue("subtitles", "subtitlesButton");
  translateValue("factsheet", "factsheetButton")
  translateValue('undo', 'undoButton');
  translateText('header', 'header');
  translateText('instructions', 'instructions');
  translateText('subtitlesLabel', 'subtitlesLabel');
  translateText('interviewLabel', 'interviewLabel');
  translateText('factsheetLabel', 'factsheetLabel');

  if(navigator.appVersion.indexOf("Mac") != -1){
    // label for mac with "cmd" character
    translateText('shortcutsLabel', 'shortcutsLabelMac');
    translateText('extensionShortcutLabel', 'extensionShortcutLabelMac')
  }else{
    translateText('shortcutsLabel', 'shortcutsLabel');
    translateText('extensionShortcutLabel', 'extensionShortcutLabel')
  }

  // here we should get what the user choosed last using localStorage
  setShortcutAvailability();
  // and also save his preference when he changes


});
