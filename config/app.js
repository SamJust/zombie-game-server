const express = require('express')
    , mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , swaggerUI = require('swagger-ui-express')
    , swaggerJSON = require('./swagger.json')
    , fs = require('fs')
    , path = require('path');

// process.on('uncaughtException', (err) => {
//   fs.appendFileSync('log.txt', `[${Date.now()}]Caught exception: ${err}\n`);
// });

const session = require('../modules/session');
const router = require('../routes');

let app = express();
// let urlencodedParser = bodyParser.urlencoded({extended:false});
let jsonParser = bodyParser.json();

app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
app.use(jsonParser);
app.use(cookieParser());
app.use(session());
app.use('/api', router);

app.get('/logs', (req, res)=>{
  res.set('Content-Type', 'text/plain');
  let stream = fs.createReadStream(path.resolve(__dirname, '../log.txt'));
  stream.on('data', chunk => {
    res.write(chunk);
  });
  stream.on('end', ()=>{
    res.end();
  });
});

app.get('/test', (req, res)=>{
  res.json({foo: 'bar'});
});

app.get('*', (req, res)=>{
  res.sendStatus(404);
});

module.exports = app;