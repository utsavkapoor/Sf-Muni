'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const port = 3000;

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use('/public', express.static(process.cwd() + '/public'));

app.route('/')
        .get(function(req, res) {
    		  res.sendFile(process.cwd() + '/public/index.html');
        })

app.listen(port, function () {
  console.log('Node.js listening ...');
});
