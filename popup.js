/**
 * Invoke the script to bolden the characters.
 *
 * @param {string} method The method applied to select characters to bolden.
 */

 function translateValue(elementId, messageName) {
   var message = browser.i18n.getMessage(messageName);
   document.getElementById(elementId).value = message;
 }
 function translateText(elementId, messageName){
   var message = browser.i18n.getMessage(messageName);
   document.getElementById(elementId).innerHTML = message;
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
});
