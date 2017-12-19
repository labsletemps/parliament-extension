/**
 * Invoke the script to bolden the characters.
 *
 * @param {string} method The method applied to select characters to bolden.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  chrome.tabs.executeScript({
    code: script
  });
}


function doQuestions(){
  chrome.tabs.executeScript({
      code: 'var config = 1;'
  }, function() {
      chrome.tabs.executeScript({file: 'addBold.js'});
  });

}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var questions = document.getElementById('questions');
    console.log('Adding stuff');
    questions.addEventListener('click', () => {
      console.log('Yolo! '+ url)
      doQuestions();
      //saveBackgroundColor(url, dropdown.value);
    });
  });
});
