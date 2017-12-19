/**
 * Invoke the script to bolden the characters.
 *
 * @param {string} method The method applied to select characters to bolden.
 */

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('intertitres').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "tete";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });

  document.getElementById('questions').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "questions";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });

  document.getElementById('encadre').addEventListener('click', () => {
    chrome.tabs.executeScript({
        code: 'var method = "encadre";'
    }, function() {
        chrome.tabs.executeScript({file: 'addBold.js'});
    });
  });

  //TODO: add an “undo” method, because ctrl-z has no effect on the script

  // maybe add the functions for quotes ("" to «»)

});
