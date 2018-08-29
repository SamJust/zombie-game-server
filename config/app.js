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

mongoose.connect("mongodb://admin:admin@ds231559.mlab.com:31559/zombie-game-app").then(
  ()=>{
    console.log("Succefull connection to DB");
  },
  ()=>{
    console.log("Something wrong with DB");
  }
);

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

app.get('*', (req, res)=>{
  res.sendStatus(404);
});

module.exports = app;