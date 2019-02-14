/**
Globals
*/

var parliamentData;
var nameList = [];
var localData = localStorage.getItem('parliamentarians');

function getParliamentarianAttr(name){
  return name.replace(' ', '-').toLowerCase();
}

function getIndividualData(name){
  var data = false;
  $.each(parliamentData['data']['parliamentarians'], function(index, item) {
    if(item['name'] === name) {
      data = item;
      return;
    }
  });
  return data;
}

function fetchParliamentIds(){
  $.ajax({
    method: "POST",
    url: "https://web.tcch.ch/parliament/",
    success : function(data, statut){ // code_html contient le HTML renvoyé
      localStorage.setItem('parliamentarians', data);
      data['data']['parliamentarians'].forEach(function(item){
        nameList.push(item['name']);
      });
    },
    error : function() {
      console.log('error')
    }
  });
}

if(localData){
  parliamentData = JSON.parse(localData);
  parliamentData['data']['parliamentarians'].forEach(function(item){
    nameList.push(item['name']);
  });
  console.log('loaded from local')
}else{
  fetchParliamentIds();
  console.log('loaded from server')
}


function lookupNames(){
  var articleTags = $('.article-content p');

  if (articleTags.length > 0){

    // Le Temps
    var p_list = $('.article-content p');
    var count0 = 0;
    var count = 0;

    for(i in p_list){
      if(p_list[i].innerHTML){
        count0++;
        var innerHTML = p_list[i].innerHTML;

        nameList.forEach(function(name){
          if(innerHTML.indexOf(name) !== -1){
            console.log('FOUND::' + name + '!!!!!');
            p_list[i].innerHTML = innerHTML.replace(name, '<span class="modal-available" data-who="pierre-maudet">' + name + '</span>');

          }
        });

        if(innerHTML.indexOf('Pierre Maudet') >= 0){
          var name = 'Pierre Maudet';
          var nameReplace = 'Pierre Maudet';
          p_list[i].innerHTML = innerHTML.replace(name, '<span class="modal-available" data-who="pierre-maudet">' + nameReplace + '</span>');
          count++;
        }
      }
    }
  }


  setTimeout(function(){
    $('span.modal-available').on('click mouseover', function(e){
      console.log('Survol / click sur ' + $(this).data('who'));
      eventHandler($(this).data('who'));
    });
  }, 200);

}

lookupNames();

var data = {
  'pierre-maudet': {
    'name': 'Pierre Maudet',
    'parti': 'PLR'
  }
}

function eventHandler(who){
  console.log(who);
  if (Object.keys(data).indexOf(who) < 0){
    console.log('Not found in data')
    return false;
  }
  tippy('.modal-available', {
    content: '<strong>' + data[who]['name'] + '</strong><p>' + data[who]['parti'] + '</p>',

    aria: null,
    autoFocus: false,
    trigger: 'mouseenter click',
    appendTo: ref => ref.parentNode,
    onMount({ reference }) {
      reference.setAttribute('aria-expanded', 'true')
    },
    onHide({ reference }) {
      reference.setAttribute('aria-expanded', 'false')
    },
    placement: 'bottom',
    arrow: true,
    interactive: true,
    distance: 7,
    animation: 'fade',
    theme: 'light-border dropdown',
    updateDuration: 0
  });
}



function log(obj){
  // toggle for debug
  // console.log(obj);
}
