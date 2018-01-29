/**
 Globals
*/

var elementFound = false;
var textareaActive = false;
var activeElement = document.activeElement;
var macos = navigator.appVersion.indexOf("Mac") != -1;
var eventListener;
var eventListenerAdded = false;
var tagTimeout = {
  'b': false,
  'i': false,
  'a': false
}

function log(obj){
  // toggle for debug
  // console.log(obj);
}

/**
 *  Disabled function. Removes wrong line breaks.
 *  It searches for each line beginning with a small letter.
 *  @param {object} textArea The textarea to edit.
 */
function eraseFalseBreaks(textArea){
  return;

  // TODO: add an option to enable this.
  // Disabled because it may have unwanted side-effects

  let textAreaRaw = textArea.value;
  textAreaRaw = textAreaRaw.replace(/\n([a-z])/g, " $1");
  textArea.value = textAreaRaw;
}

/**
 *  Adds bold to each line without a dot.
 *  @param {object} textArea The textarea to edit.
 */

function subtitles(textArea){
  // save current text for “undo” function
  localStorage.setItem('initialText', textArea.value);

  eraseFalseBreaks(textArea);
  let lines = textArea.value.split("\n");

  for (i=0;i<lines.length;i++){
    if(lines[i] == ""){
      // empty paragraph: pass
    }else{
      if( ( !lines[i].match(/\./g) ) && ( !lines[i].match("<b>") ) ){ // No point in the paragraph; and it has no bold yet
        lines[i] = "<b>" + lines[i] + "</b>";
      }
      // else: pass
    }
  }
  textArea.value = lines.join('\n');
}

/**
 *  Adds bold to each interview question.
 *  @param {object} textArea The textarea to edit.
 */

function interview(textArea){
  // save current text for “undo” function
  localStorage.setItem('initialText', textArea.value);

  eraseFalseBreaks(textArea);
  let lines = textArea.value.split('\n');
  let qaIndex = 0; // question-answer index, incremented for each question or answer

  for (i=0;i<lines.length;i++)
  {
    if(lines[i] == '')
    {
      // pass
    }
    else
    {
      if(qaIndex<1)	// avant la 1ere question
      {
        if((lines[i].match(/^.{1,240}\?$/g))&&(lines[i].substring(0,1)!='<'))	// Identification de la 1e question: chaîne de max. 240 caractères terminée par un point && ne commence pas par un tag html (= question déjà traitée, iframe)
        {
          // add a line break
          lines[i] = '\n<b>' + lines[i] + '</b><br />';
          qaIndex++;
        }
        // else: paragraph before the iterview began: pass

      }
      else	// qaIndex > 0: we’re in the interview
      {
        if((qaIndex%2==0)&&(lines[i].substring(0,3)!='<b>'))	// even => question
        {
          lines[i] = '\n<b>' + lines[i] + '</b><br />'; //	bold then newline
          qaIndex++;
        }
        else	// answer: no bold
        {
          qaIndex++;
        }
      }
    }
  }
  textArea.value = lines.join('\n');
}

/**
 *  Adds bold to each beginning of line until the “:” character.
 *  @param {object} textArea The textarea to edit.
 */

function factsheet(textArea){
  // save current text for “undo” function
  localStorage.setItem('initialText', textArea.value);

  let lines = textArea.value.split("\n");

  for ( i=0; i<lines.length; i++ ){
    // Paragraph without “:”: we pass
    if( lines[i].indexOf(':') < 0 ){
      // pass
    }else{
      let chain = lines[i].split(':'); // ^\d{4}$
      if(chain[0] == ''){
        chain.splice(0, 1);
      }
      if(chain[0].indexOf('<b>') >= 0){ // already contains <b>: don’t add bold again
        lines[i] = chain[0];
      }else{
        lines[i] = '<b>'+chain[0]+'</b>';
      }

      chainLength = chain.length;
      for(c=1;c<chainLength;c++){
        lines[i] += ':' + chain[c];
      }
    }
  }
  textArea.value = lines.join('\n');
}


/**
 * Get the focused textarea.
 * Find it even if our user didn't focus it.
 */

// We use “var” instead of “let” so the variable may be overwritten when the script reloads.



function highlightTextarea(textArea){
  // remove previous highlighted element
  let highlighted = document.querySelector('.addBoldHighlighted');
  if(highlighted){
    log('Removing previous highlight')
    highlighted.style.border = '1px solid #1c55a0';
    highlighted.classList.remove('addBoldHighlighted');
  }else{
    log('No previous highlight found')
  }

  textArea.classList.add('addBoldHighlighted');
  textArea.style.border = '3px dashed #1c55a0';
}

/**
  100ms timeout to prevent duplicate action
*/
function getTagTimeout(tagName){
  return tagTimeout[tagName];
}
function setTagTimeout(tagName){
  tagTimeout[tagName] = true;
  setTimeout(function(){
    tagTimeout[tagName] = false;
  }, 100);
}

/**
 * Add tags for bold, italic and hyperlink
 */

function addTag(startTag, endTag, textArea){
  let len = textArea.value.length;
  let selectionStart = textArea.selectionStart;
  let selectionEnd = textArea.selectionEnd;

  // preserve potential area scrolling
  let scrollTop = textArea.scrollTop;
  let scrollLeft = textArea.scrollLeft;
  let currentSelection = textArea.value.substring(selectionStart, selectionEnd);

  let replace = '';
  let tagsLength = startTag.length + endTag.length;
  if(currentSelection.indexOf(startTag) < 0){
    replace = startTag + currentSelection + endTag;
  }else{
    // If the tag is already there, remove it
    replace = currentSelection.replace(startTag, '').replace(endTag, '');
    tagsLength *= -1;
  }

  // replace textarea value
  textArea.value = textArea.value.substring(0, selectionStart) + replace + textArea.value.substring(selectionEnd, len);

  // restore selection
  textArea.setSelectionRange(selectionStart, selectionEnd + tagsLength);
  textArea.scrollTop = scrollTop;
  textArea.scrollLeft = scrollLeft;
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

/**
 * NB browser.commands may be better in the future.
 * It doesn’t seem flexible enough yet:
 * we need to easily toggle these shortcuts.
*/

/**
 * Named function called by the named function sendShortcut
 * All this to be able to remove the eventListener
 */
function applyShortcut(e){
  if(!textareaActive){
    log('NO active ta')
    // If no textarea is focused
    return;
  }
  if(e.ctrlKey || e.metaKey){
    // If alt or shift modifier: exit here
    if(e.altKey || e.shiftKey){
      return;
    }
    // If not MacOS, only take the ctrl key into account
    if(e.ctrlKey || macos){
      switch(e.key){
        case 'b':
          e.preventDefault();
          if(!getTagTimeout('b')){
            setTagTimeout('b');
            addTag('<b>', '</b>', document.activeElement);
          }
          break;
        case 'i':
          e.preventDefault();
          if(!getTagTimeout('i')){
            setTagTimeout('i');
            addTag('<i>', '</i>', document.activeElement);
          }
          break;
        case 'k':
          e.preventDefault();
          if(!getTagTimeout('k')){
            setTagTimeout('k');
            addTag('<a href="https://www.example.org">', '</a>', document.activeElement);
          }
          break;
        default:
          break;
      }
    }
  }
}

function sendShortcut(e){
  if(shortcutsOn){
    applyShortcut(e);
  }
}

if(shortcutsOn && !eventListenerAdded){
  // Avoid adding multiple listeners
  document.addEventListener('keydown', sendShortcut);
  //log(getEventListeners(document));
  eventListenerAdded = true;
}else{
  // disable shortcuts when the script is already running
  document.removeEventListener('keydown', sendShortcut);
  log('Removing event listener')
}

if(activeElement){
  if(activeElement.tagName == 'TEXTAREA'){
    log('Active element is a textarea.')
    elementFound = true;
    textareaActive = true;
  }else if((activeElement.tagName == 'INPUT')
    && (activeElement.type == 'text')){
      elementFound = true;
      textareaActive = true;
  }
}
if(!elementFound){
  activeElement = document.getElementById('bodytext');
  if(activeElement){
    log('Textarea found using id “bodytext”.')
    elementFound = true;
  }else{
    let taList = document.getElementsByTagName("TEXTAREA");
    if (taList.length > 0){
      activeElement = taList[0];
      log('First textarea selected.')
      elementFound = true;
    }
  }
}

/**
 * Call the appropriate function.
 * Sort of argument, the extension way.
 */
if (typeof method == 'undefined') {
  // To prevent an error when the extension loads at first.
  // We use “var” instead of “let” so it may be overwritten.
  var method = 'not set';
}
if(activeElement && elementFound){
  if(method == 'highlight'){
    highlightTextarea(activeElement);
  }else if(activeElement.value != ''){
    log('Method is')
    log(method)
    switch(method) {
      case 'highlight':
        highlightTextarea(activeElement);
        break;
      case 'subtitles':
        subtitles(activeElement);
        break;
      case 'interview':
        interview(activeElement);
        break;
      case 'factsheet':
        factsheet(activeElement);
        break;
      case 'undo':
        log('undo');
        activeElement.value = localStorage.getItem('initialText');
        break;
      default:
        break;
    }
  }
}
// reset method -- quick dirty fix
method = 'not set';
