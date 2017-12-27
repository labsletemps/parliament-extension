/**
 * Invoke the script to bolden the characters.
 *
 * @param {string} method The method applied to select characters to bolden.
 */

function log(obj){
  // toggle for debug
  // console.log(obj);
}

var popupLoaded = false;
function setShortcutPreference(value) {
 log("Saving pref: " + value)
 chrome.storage.sync.set({
   noShortcut: value
 }, function(){
   setTimeout(function(){
     document.getElementById('shortcutsTick').style.display = 'inline-block';
   }, 200);
 });
}
function getShortcutPreference(){
 chrome.storage.sync.get({
   noShortcut: false
 }, function(items){
   document.getElementById('shortcuts').checked = !items.noShortcut;
   setDisableShortcut(items.noShortcut);
   return items.noShortcut;
 });
}

function translateValue(elementId, messageName) {
 document.getElementById(elementId).value = chrome.i18n.getMessage(messageName);
}
function translateText(elementId, messageName){
 document.getElementById(elementId).innerText = chrome.i18n.getMessage(messageName);
}

function setDisableShortcut(disable = false){
  document.getElementById('shortcutsTick').style.display = 'none';

  // Immediately disable the shortcut if the user saved this choice
  if(disable){
    log('Disable directly')
    chrome.tabs.executeScript({
      code: 'var shortcutsOn = "false";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  }else if ( document.getElementById('shortcuts').checked == false ){

    // Enable shortcut
    chrome.tabs.executeScript({
      code: 'var shortcutsOn = "false";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });

    // Save pref in browser
    setShortcutPreference(true);
  }else{
    // Disable shortcuts
    chrome.tabs.executeScript({
      code: 'var shortcutsOn = "true";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });

    // Save pref in browser
    setShortcutPreference(false);
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

  if(!popupLoaded){
    document.getElementById('shortcuts_p').addEventListener('click', () => {
      setDisableShortcut();
    });
  }

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

  // Get the user’s choice using localStorage
  // otherwise toggling the extension or changing tab loses his choice

  log(getShortcutPreference());
  /*
  if(getShortcutPreference() == "true"){
    document.getElementById('shortcuts').checked = false;
    setShortcutAvailability(true);
  }else{
    log("No shortcuts is false.")
    setShortcutAvailability();
  }*/

  popupLoaded = true;

});
