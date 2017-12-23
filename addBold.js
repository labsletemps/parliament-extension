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
  localStorage.setItem('initialText', textArea.value);
  eraseFalseBreaks(textArea);
  var txtNew = "";
  var arr = textArea.value.split("\n");

  for (i=0;i<arr.length;i++){
    if(arr[i] == ""){
      txtNew += arr[i] + '\n'; 			// Paragraphe vide: on passe
    }else{
      if( ( !arr[i].match(/\./g) ) && ( !arr[i].match("<b>") ) ){ // No point in the paragraph; and it has no bold yet
        txtNew += "<b>" + arr[i] + "</b>\n";
      }else{
        txtNew += arr[i] + "\n";
      }
    }
  }
  textArea.value = txtNew;
}

function interview(textArea){ // Mise en gras avec espacement
  localStorage.setItem('initialText', textArea.value);
  eraseFalseBreaks(textArea);
  var txtNew = "";
  var textAreaLines = textArea.value.split('\n');
  var numberOfLines = textAreaLines.length;
  var qrIndex = 0;

  for (i=0;i<numberOfLines;i++)
  {
    if(textAreaLines[i] == '')	// paragraphe vide: on passe
    {
      txtNew += textAreaLines[i] + '\n';
    }
    else
    {
      if(qrIndex<1)	// avant la 1ere question
      {
        if((textAreaLines[i].match(/^.{1,240}\?$/g))&&(textAreaLines[i].substring(0,1)!='<'))	// Identification de la 1e question: chaîne de max. 240 caractères terminée par un point && ne commence pas par un tag html (= question déjà traitée, iframe)
        {
          txtNew += '\n<b>' + textAreaLines[i] + '</b><br />';
          qrIndex++;
        }
        else	// paragraphes avant l’interview: on traite et on passe
        {
          txtNew += textAreaLines[i] + '\n';
        }

      }
      else	// qrIndex > 0: on est dans l’enchaînement question-réponse
      {
        if((qrIndex%2==0)&&(textAreaLines[i].substring(0,3)!='<b>'))	// pair = question
        {
          txtNew += '\n<b>' + textAreaLines[i] + '</b><br />'; //	gras + se termine par un saut de ligne
          qrIndex++;
        }
        else	// réponse: mise en forme normale
        {
          qrIndex++;
          txtNew += textAreaLines[i] + '\n';
        }
      }
    }
  }
  textArea.value = txtNew;
}

function factsheet(textArea){
  localStorage.setItem('initialText', textArea.value);
  var txtNew = "";
  var arr = textArea.value.split("\n");

  for (i=0;i<arr.length;i++){
    // Paragraphe sans “:” ou contenant déjà un <b>: on passe
    if( (arr[i].indexOf(':') < 0) && (arr[i].indexOf('<b>') < 0) ){
      txtNew += arr[i] + '\n';
    }else{
      var chain = arr[i].split(':'); // ^\d{4}$
      if(chain[0] == ''){
        chain.splice(0, 1);
      }
      txtNew += '<b>'+chain[0]+'</b>';
      chainLength = chain.length;
      for(c=1;c<chainLength;c++){
        txtNew += ':' + chain[c];
      }
      txtNew += '\n';
    }
  }
  textArea.value = txtNew;
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
  var activeElement = document.getElementById('bodytext');
  if(activeElement){
    console.log('Textarea found using id “bodytext”.')
  }else{
    var taList = document.getElementsByTagName("TEXTAREA");
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
if(shortcutsOn){
  console.log('Listening to shortcuts…')
  document.onkeydown = function(e){

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

/*
Call the appropriate function.
We could avoid it if we hadn’t to inject code using executeScript.
*/

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
}else{
  console.log('Empty textarea.')
}
