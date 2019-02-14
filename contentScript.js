/**
Globals
*/

var parliamentData;
var nameList = [];
var localData = localStorage.getItem('parliamentarians');

var currentPeople = {};

function getDataWho(name){
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")   // on enleve les accents
  return name.replace(' ', '-').toLowerCase();
}

function getParti(data){
  if('partyMembership' in data){
    if ('party' in data['partyMembership']){
      if ('abbr' in data['partyMembership']['party']){
        return data['partyMembership']['abbr']
      }
    }
  }
  return '';
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
    success : function(data, statut){
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
    var p_list = $('.article-content p');     // Le Temps
    var count0 = 0;
    var count = 0;

    for(i in p_list){
      if(p_list[i].innerHTML){
        count0++;
        var innerHTML = p_list[i].innerHTML;

        nameList.forEach(function(name){
          if(innerHTML.indexOf(name) !== -1){
            var dataWho = getDataWho(name);
            currentPeople[dataWho] = name;
            p_list[i].innerHTML = innerHTML.replace(name, '<span class="modal-available ' + dataWho + '" data-who="' + dataWho + '">' + name + '</span>');
          }
        });
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

function eventHandler(who){
  var individualData = getIndividualData(currentPeople[who]);
  if(! individualData){
    console.log('Not found in data')
    return false;
  }else{
    console.log('Data found for ' + currentPeople[who]);
  }
  var parti = getParti(individualData);

  function addInfo(item){
    return '<p class="individual-info">' + item + '</p>';
  }
  function addListItem(item){
    return '<p class="individual-list-item">' + item + '</p>';
  }
  var content = '<h3>' + individualData['name'] + '</h3>';
  content += '<img class="individual-img" src="' + individualData['portrait'] + '" alt="' + individualData['name'] + '">';
  content += addInfo(individualData['councilTitle']);
  content += addInfo(individualData['canton']);
  if(parti) {
    content += addInfo(parti);
  }

  tippy('.modal-available.' + who, {
    content: content,
    aria: null,
    autoFocus: false,
    trigger: 'click', // mouseenter
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
    updateDuration: 0,

    onShow(instance) {
      // TODO check if local version up to date
      var localIndividualData = localStorage.getItem(who);

      if(localIndividualData){
        data = JSON.parse(localIndividualData);
        content += addInfo('<b>Liens d’intérêt</b>')
        data['data']['getParliamentarian']['connections'].forEach(function(item){
          content += addInfo(item['to']['name'])
        });
        instance.setContent(content);

      }else{
        var load = {"query":
          query,
          "variables":{"locale":"fr","id": individualData['id']}
        }

        $.ajax({
          method: "POST",
          url: "https://lobbywatch.ch/graphql",
          contentType: "application/json",
          data: JSON.stringify(load),
          success : function(data, statut){ // code_html contient le HTML renvoyé
            console.log('done')
            console.log(data);
            localStorage.setItem(who, JSON.stringify(data));
            content += addInfo('<b>Liens d’intérêt</b>')
            data['data']['getParliamentarian']['connections'].forEach(function(item){
              content += addInfo(item['to']['name'])
            })
            instance.setContent(content);
          },
          error : function() {
            console.log('error')
          }
        });

      }


    }
  });
}

var query = `query getParliamentarian($locale: Locale!, $id: ID!) {
  getParliamentarian(locale: $locale, id: $id) {
    name
    active
    canton
    represents
    parliamentId
    dateOfBirth
    gender
    represents
    councilJoinDate
    councilTenure
    age
    occupation
    commissions {
      name
    }
    guests {
      id
      name
    }
    connections {
      group
      potency
      function
      compensation {
        money
        description
        __typename
      }
      from {
        __typename
      }
      to {
        __typename
        ... on Organisation {
          id
          name
          __typename
        }
      }
      vias {
        __typename
        to {
          ... on Guest {
            id
            name
            __typename
          }
          __typename
        }
      }
      __typename
    }
  }
}`;
