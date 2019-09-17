# Parliament Extension

This extension shows informations about members of the National and State Councils in Switzerland.

## Testing the development version

### Chrome
Type chrome://extensions/ in the address bar, then click “Load unpacked extension” and choose the extension folder

### Firefox
Type about:debugging in the address bar, then click “Load temporary addon” and choose any file in the extension folder

Then you can test it on a page such as [this one](https://www.letemps.ch/suisse/vague-verte-vents-contraires-radiographie-partis-quatre-mois-elections-federales) or [this other one](https://www.beobachter.ch/burger-verwaltung/lobbyisten-bundesbern-der-befangenenchor)

## Setup the dev environment

* install [web-ext](https://github.com/mozilla/web-ext) globally: `npm install --global web-ext`
* install sass globally: `npm install -g sass`
* if you edit the stylesheets, run sass in the command-line: `sass --watch contentStyle.scss contentStyle.css`
* run web-ext: `web-ext run`

### Build
Use `web-ext build` or `git archive -o my-archive.zip HEAD` to create the extension zip file without the “.git” folder.

Developed for Firefox Add-Ons and the Chrome Web Store.
