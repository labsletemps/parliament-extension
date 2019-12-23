import requests
import json

update_timestamp = '2019-12-23'

for lang in ['fr', 'de']:
    load = {'query': '''  query parliamentarians($locale: Locale!) {
    parliamentarians(locale: $locale) {
      id
      name
      firstName
      lastName
      portrait
      councilTitle
      canton
      partyMembership {
        party {
          abbr
        }
      }
    }
  }''',
  "variables":{"locale":lang}}

    response = requests.post('https://lobbywatch.ch/graphql', json=load)
    data = response.json()

    print('Data contains', len(data['data']['parliamentarians']), 'parliamentarians')

    data['updated'] = update_timestamp

    phpcontent = '''<?php
header("Access-Control-Allow-Origin: *");
?>''' + json.dumps(data)

    with open('server/' + lang + '/index.php', 'w') as f:
        f.write(phpcontent)
        print('saved as php')
