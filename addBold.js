/**
 * Functions for each method.
 * eraseFalseBreaks deals with erroneous line breaks from PDF or editing softwares.
 *
 *  @param {object} textArea The textarea to edit.
 */

function eraseFalseBreaks(textArea){ // Elimine les faux sauts de ligne de Methode
  var textAreaRaw = textArea.value;
  textAreaRaw = textAreaRaw.replace(/\n([a-z])/g, " $1");
  textArea.value = textAreaRaw;
}

function subtitles(textArea){ // Mise en gras avec espacement
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

function interview(textArea){ // Mise en gras avec espacement
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
Get the focused textarea.
Find it even if our user doesn’t focus it.
*/
var elementFound = false;
var activeElement = document.activeElement;
if(activeElement){
  if(activeElement.tagName == 'TEXTAREA'){
    console.log('Active element is a textarea.')
    elementFound = true;
  }else{
    console.log('Active element is NOT a textarea.')
  }
}
if(!elementFound){
  let activeElement = document.getElementById('bodytext');
  if(activeElement){
    console.log('Textarea found using id “bodytext”.')
  }else{
    let taList = document.getElementsByTagName("TEXTAREA");
    if (taList.length > 0){
      activeElement = taList[0];
      console.log('First textarea selected.')
    }
  }
}

/**
* shortcuts for bold, italic and links
*/

function addTag(startTag, endTag, textArea){
  var len = textArea.value.length;
  var selectionStart = textArea.selectionStart;
  var selectionEnd = textArea.selectionEnd;

  // preserve potential area scrolling
  var scrollTop = textArea.scrollTop;
  var scrollLeft = textArea.scrollLeft;
  var currentSelection = textArea.value.substring(selectionStart, selectionEnd);

  var replace = '';
  var tagsLength = startTag.length + endTag.length;
  if(currentSelection.indexOf(startTag) < 0){
    replace = startTag + currentSelection + endTag;
  }else{
    // remove tag if tag was already formatted
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

var macos = navigator.appVersion.indexOf("Mac") != -1;

if (typeof shortcutsOn == 'undefined') {
  var shortcutsOn = true;
}

// NB Maybe browser.commands may be better in the future.
// Right now it doesn’t seem flexible enough.

if(shortcutsOn){
  console.log('Listening to shortcuts…')
  document.onkeydown = function(e){
    // TODO: return if shift key / alt key is down

    if(e.ctrlKey || e.metaKey){

      // If not MacOS, only take the ctrl key into account
      if(e.ctrlKey || macos){
        switch(e.key){
          case 'b':
            e.preventDefault();
            addTag('<b>', '</b>', document.activeElement);
            break;
          case 'i':
            e.preventDefault();
            addTag('<i>', '</i>', document.activeElement);
            break;
          case 'k':
            e.preventDefault();
            addTag('<a href="">', '</a>', document.activeElement);
            break;
          default:
            break;
        }
      }
    }
  }
}else{
  document.onkeydown = null;
}

/**
* Call the appropriate function.
* Sort of argument, the extension way
*/
if (typeof method == 'undefined') {
  var method = 'not set';
}

if(activeElement.value != ''){
  switch(method) {
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
      activeElement.value = localStorage.getItem('initialText');
      break;
  }
}
