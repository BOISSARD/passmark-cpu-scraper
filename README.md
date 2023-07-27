# Passmark CPU Scraper to CSV

Node.js server that parses Passmark's http://www.cpubenchmark.net/CPU_mega_page.html and returns CSV file

## Usage

### Install packages

```
npm install
```

If you don't have nodemon and you want to work on the project, install also the nodemon package in global.
```
npm install -g nodemon
```

### Start the app
```
node app.js
# If working on the project
nodemon app.js
```

if certificate error do
```
NODE_TLS_REJECT_UNAUTHORIZED='0' node app.js
# If working on the project
NODE_TLS_REJECT_UNAUTHORIZED='0' nodemon app.js
```

Use nodemon instead of node when working on the project, becarefull if it is restarting in infinite loop because of error in the code.

### Launch the app
open [http://localhost:8081/](http://localhost:8081/)

## Legals

Note that while you can do whatever you care to with this code, the data you scrape with it is for your personal use only.
http://www.passmark.com/legal/disclaimer.htm
