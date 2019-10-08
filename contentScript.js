/**
Globals
*/

// TODO i18n change this for 'de'
// chrome.i18n.getMessage(
var locale = 'fr';
var parliamentData;
var localData = localStorage.getItem('parliamentarians');
var nameList = [];
var currentPeople = {};
var POTENCY_WEIGHT = {
  HIGH: 1000,
  MEDIUM: 50,
  LOW: 1
}

var needsUpdate = function(){
  // uncomment to bypass cache
  console.log('yes needs update')
  return true;

  // expire après 1 heure:                       milli  sec  min  heures
  if( (new Date().getTime() - localData['data']['lastUpdate']) < (1000 * 60 * 60 * 1) ){
    return false;
  }else{
    return true;
  }
}

// Maybe for a next release? Overlay
// $('body').append('<div class="addon-overlay" id="addon-overlay"></div>');

// For react websites
var first_href = window.location.href;
if( window.location.origin.includes('beobachter.ch') ){
  // console.log('Beobachter – trigger on click')
  $('body').click(function(){
    console.log('click')
    if(window.location.href != first_href){
      console.log('New href: ' + window.location.href);
      setTimeout(lookupNames, 1200);
      setTimeout(lookupNames, 2100);
      first_href = window.location.href;
    }else{
      console.log('no href change')
    }
  })
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
  return name.replace(/ /g, '-').toLowerCase();
}

function getParty(data){
  if('partyMembership' in data){
    if(data['partyMembership'] == null){
      return '–';
    }
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
  if(via.length > 0){
    return "(via " + via[0]['to']['name'] + ')';
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
    type: "json",
    method: "POST",
    // url: "https://labs.letemps.ch/interactive/2019/parliament-extension/data/",
    url: "https://web.tcch.ch/parliament/v3/",
    success : function(data, statut){
      console.log('Data retrieved');
      localStorage.setItem('parliamentarians', data);
      parliamentData = JSON.parse(data);
      console.log(parliamentData['data']['updated'])
      parliamentData['data']['parliamentarians'].forEach(function(item){
        nameList.push(item['name']);
      });
      lookupNames();
    },
    error : function(xhr, status, error) {
      console.log('Error when fetching parliament data: ' + status + ' ' + error);
    }
  });
}

if(localData && !needsUpdate){
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
            regexp = new RegExp('([^"])' + name);
            innerHTML = innerHTML.replace(regexp, '$1<span class="modal-available ' + dataWho + '" data-who="' + dataWho + '">' + name + '</span>');
          }
        });

        p_list[i].innerHTML = innerHTML;
      }
    }
  }

  setTimeout(function(){
    $('span.modal-available').on('click mouseover', function(e){
      // console.log('Survol / click sur ' + $(this).data('who'));
      eventHandler($(this).data('who'));
    });
  }, 200);
}

lookupNames();

function eventHandler(who){
  var individualData = getIndividualData(currentPeople[who]);

  if(! individualData){
    console.log('Parliament Extension: politician not found in data')
    return false;
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
          <span class="person-name"><a target="_blank" href="https://lobbywatch.ch/fr/daten/parlamentarier/${individualData['id']}/${individualData['name']}">${individualData['name']}</a></span>
          <div class="person-infos">${individualData['councilTitle']}, ${individualData['canton']}, ${party}</div>
        </div>

        <div class="person-text-body">
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
    // appendTo: ref => ref.parentNode,
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
      // inner func
      function displayData(data){

        if(!instance.loaded){
          content += addInfo('<b>' + chrome.i18n.getMessage('tipInterests') + '</b>')
          li_str = '';

          /* guests */
          if(!data){
            li_str = '<p class="error">' + chrome.i18n.getMessage('errorMessage') + '</p>';
          }
          var guests = data['data']['getParliamentarian']['guests'];
          var guestNames = [];
          if(guests.length > 0){
            guests.forEach(function(item){
              guestNames.push(item['name']);
              content += addListItem(item['name']);
            });
          }

          /*
            group and nest:
            https://github.com/lobbywatch/website/blob/master/src/components/Connections/index.js
            https://github.com/lobbywatch/website/blob/master/src/components/Connections/nest.js
          */

          var groups = groupBy(data['data']['getParliamentarian']['connections'], 'potency');

          function displayGroup(group){
            if(!group){
              return null;
            }
            _li_str = '';
            group.forEach(function(item){
              var via = getVia(item['vias']);
              if(!via){
                _li_str += addListItem(item['to']['name'] + ', ' + item['function']);
              }else{
                _li_str += addListItem(item['to']['name'] + ' ' + via);
              }
            });
            return _li_str;
          }

          var interestsHigh = displayGroup(groups['HIGH']);
          if(interestsHigh){
            li_str += addListHeader( chrome.i18n.getMessage('tipInterestsHIGH') );
            li_str += interestsHigh;
          }
          var interestsMedium = displayGroup(groups['MEDIUM']);
          if(interestsMedium){
            li_str += addListHeader( chrome.i18n.getMessage('tipInterestsMEDIUM') );
            li_str += interestsMedium;
          }
          var interestsLow = displayGroup(groups['LOW']);
          if(interestsLow){
            li_str += addListHeader( chrome.i18n.getMessage('tipInterestsLOW') );
            li_str += interestsLow;
          }

          var template_loaded = `<div class="person">
              <div class="person-picture" style="background-image: url('${individualData['portrait']}')"></div>

              <div class="person-txt">
                <a class="lobbywatch-logo" target="_blank" href="https://lobbywatch.ch/fr/daten/parlamentarier/${individualData['id']}/${individualData['name']}">
                  <img src="${chrome.extension.getURL('icon32.png')}" alt="Lobbywatch" />
                </a>

                <div class="person-txt-header">
                  <span class="person-name"><a target="_blank" href="https://lobbywatch.ch/fr/daten/parlamentarier/${individualData['id']}/${individualData['name']}">${individualData['name']}</a></span>
                  <span class="person-infos">${individualData['councilTitle']}, ${individualData['canton']}, ${party}</span>
                </div>

                <div class="person-text-body">
                  <p><b>${chrome.i18n.getMessage('guests')}:</b> ${guestNames.join(", ")}</p>
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
