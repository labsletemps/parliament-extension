# Parliament Extension

This extension shows informations about members of the National and State Councils in Switzerland.

## Installation

To setup the dev environment:
* install [web-ext](https://github.com/mozilla/web-ext) globally: `npm install --global web-ext`
* install sass globally: `npm install -g sass`
* if you edit the stylesheets, run sass in the command-line: `sass --watch contentStyle.scss contentStyle.css`
* run web-ext: `web-ext run`

## Build
Use `web-ext build` or `git archive -o my-archive.zip HEAD` to create the extension zip file without the “.git” folder.

Developed for Firefox Add-Ons and the Chrome Web Store.
