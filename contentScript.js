/**
Globals
*/

// TODO i18n change this for 'de'
var locale = 'fr';
var parliamentData;
var nameList = [];
var localData = localStorage.getItem('parliamentarians');
var currentPeople = {};
var POTENCY_WEIGHT = {
  HIGH: 1000,
  MEDIUM: 50,
  LOW: 1
}

// Ceasar Bautista on https://stackoverflow.com/a/34890276
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function getDataWho(name){
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")   // on enleve les accents
  return name.replace(' ', '-').toLowerCase();
}

function getParty(data){
  if('partyMembership' in data){
    if ('party' in data['partyMembership']){
      if ('abbr' in data['partyMembership']['party']){
        return data['partyMembership']['party']['abbr']
      }
    }
  }
  console.log('party not found')
  return '';
}

function getVia(via){
  console.log(via);
  if(via.length > 0){
    return "(via l’invité: " + via[0]['to']['name'] + ')';
  }
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

// TODO hoster sur labs.letemps.ch
function fetchParliamentIds(){
  $.ajax({
    method: "POST",
    url: "https://web.tcch.ch/parliament/",
    success : function(data, statut){
      console.log('Data retrieved');
      localStorage.setItem('parliamentarians', data);
      data['data']['parliamentarians'].forEach(function(item){
        nameList.push(item['name']);
      });
    },
    error : function(xhr, status, error) {
      console.log('Error when fetching parliament data');
    }
  });
}

if(localData){
  // console.log('also fetch to test')
  // fetchParliamentIds();

  parliamentData = JSON.parse(localData);
  parliamentData['data']['parliamentarians'].forEach(function(item){
    nameList.push(item['name']);
  });
  console.log('Parliament: Interests loaded from localStorage');
}else{
  console.log('Parliament: fetching Interests data');
  fetchParliamentIds();
}

function lookupNames(){
  var p_list = $('p');

  if (p_list.length > 0){
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
  var party = getParty(individualData);

  function addInfo(item){
    return '<p class="individual-info">' + item + '</p>';
  }
  function addListHeader(item){
    return '<li class="list-header">' + item + '</li>';
  }
  function addListItem(item){
    return '<li class="list-item">' + item + '</li>';
  }
  // TODO: templating

  var template_base = `<div class="person">
      <div class="person-picture" style="background-image: url('${individualData['portrait']}')"></div>
      <div class="person-txt">
        <div class="person-txt-header">
          <h2 class="person-name">${individualData['name']}</h2>
          <div class="person-infos">${individualData['councilTitle']}, ${individualData['canton']}, ${party}</div>
          <div class="person-lobbywatch-url"><a href="https://lobbywatch.ch/fr/daten/parlamentarier/235/Christian%20Levrat" target="_blank">${chrome.i18n.getMessage('lobbywatchURL')}</a></div>
        </div>

        <div class="person-text-body">
          <h3 class="person-text-body-title">${chrome.i18n.getMessage('tipInterestsHigh')}</h3>
          <ul class="person-links-list">
            <li>${chrome.i18n.getMessage('loadingInterests')}</li>
          </ul>
        </div>

    </div>
  </div>`;

  var content = '';

  var targets = document.querySelector('.modal-available');


  // tippy('.modal-available.' + who, {
  tippy('.modal-available.' + who, {
    content: template_base,
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
      /*document.querySelectorAll('.tippy-popper').forEach(popper => {
        console.log('CLOSE')
        if (popper !== instance.popper) {
          popper._tippy.hide()
        }
      });*/

      // inner func
      function displayData(data){

        if(!instance.loaded){
          content += addInfo('<b>' + chrome.i18n.getMessage('tipInterests') + '</b>')
          li_str = '';

          var interests = {'parlamentarian': [], 'guest1': [], 'guest2': []};

          /* group and nest:
            https://github.com/lobbywatch/website/blob/master/src/components/Connections/index.js
            https://github.com/lobbywatch/website/blob/master/src/components/Connections/nest.js

          */

          function sortGroups(a, b){
            // low high medium
            // POTENCY_WEIGHT
          }
          console.group('Groupby');

          var groups = groupBy(data['data']['getParliamentarian']['connections'], 'potency');

          function displayGroup(group){
            if(!group){
              console.log('WARNING: Empty group')
              return;
            }
            _li_str = '';
            group.forEach(function(item){
              var via = getVia(item['vias']);
              if(!via){
                _li_str += addListItem(item['to']['name'] + ', ' + item['function']);
              }else{
                console.log(via)
                // TODO
              }
            });
            return _li_str;
          }

          li_str += displayGroup(groups['HIGH']);
          li_str += addListHeader('Liens d’intérêt moyens');
          li_str += displayGroup(groups['MEDIUM']);
          li_str += addListHeader('Liens d’intérêt faibles');
          li_str += displayGroup(groups['LOW']);

          /*var groups = groupBy(data['data']['getParliamentarian']['connections'], 'group');

          Object.keys(groups).forEach(function(key) {
            console.log('length: ' + groups[key].length)
            console.log(groups[key])
            if(groups[key].length > 0){
               li_str += addListHeader(key);
               groups[key].forEach(function(item){

                 var via = getVia(item['vias']);
                 if(!via){
                   interests['parlamentarian'].push(item['to']['name'] + ', ' + item['function']);
                   content += addListItem(item['to']['name'] + ', ' + item['function']);
                   li_str += addListItem(item['to']['name'] + ', ' + item['function']);
                 }else{
                   console.log(via)
                   // TODO
                 }
               });
              }
          });*/

          console.groupEnd();


          data['data']['getParliamentarian']['connections'].forEach(function(item){

            var via = getVia(item['vias']);
            if(!via){
              interests['parlamentarian'].push(item['to']['name'] + ', ' + item['function']);
              content += addListItem(item['to']['name'] + ', ' + item['function']);
              li_str += addListItem(item['to']['name'] + ', ' + item['function']);
            }else{
              console.log(via)
              // TODO
            }
          });
          // console.log(interests);

          content += '</ol>';

          var template_loaded = `<div class="person">
              <div class="person-picture" style="background-image: url('${individualData['portrait']}')"></div>

              <div class="person-txt">

                <div class="person-txt-header">
                  <span class="person-name"><a target="_blank" href="https://lobbywatch.ch/fr/daten/parlamentarier/235/Christian%20Levrat">${individualData['name']}</a></span>
                  <span class="person-infos">${individualData['councilTitle']}, ${individualData['canton']}, ${party}</span>
                  <div class="person-lobbywatch-url"><a href="https://lobbywatch.ch/fr/daten/parlamentarier/235/Christian%20Levrat" target="_blank">${chrome.i18n.getMessage('lobbywatchURL')}</a></div>
                </div>

                <div class="person-text-body">
                  <h3 class="person-text-body-title">${chrome.i18n.getMessage('tipInterestsHigh')}</h3>
                  <ul class="person-links-list">
                    ${li_str}
                  </ul>
                </div>

            </div>

          </div>`;


          instance.setContent(template_loaded);
        }
        instance.loaded = true;
      }

      // TODO check if local version up to date
      var localIndividualData = localStorage.getItem(who);

      if(localIndividualData){
        data = JSON.parse(localIndividualData);
        displayData(data);

      }else{
        var load = {"query":
          query,
          "variables":{"locale": locale, "id": individualData['id']}
        }

        $.ajax({
          method: "POST",
          url: "https://lobbywatch.ch/graphql",
          contentType: "application/json",
          data: JSON.stringify(load),
          success : function(data, statut){ // code_html contient le HTML renvoyé
            console.log('graphql query done')
            localStorage.setItem(who, JSON.stringify(data));
            displayData(data);
          },
          error : function() {
            console.log('error when querying lobbywatch')
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
