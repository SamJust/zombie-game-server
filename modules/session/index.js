const mongoose = require('mongoose')
    , jwt = require('jsonwebtoken')
    , fs = require('fs');

const secretString = require('../../config/config.json');

let sessions = {};

let Session = mongoose.model('sessions');

Session.findOne({}).then(data=>{
  (data===null)? sessions = {} : sessions = data.sessions;
  console.log('Sessions loaded');
}).catch(err => console.log(err.message));

module.exports = (req, res, next)=>{
  let token = {};
  if(req.cookies.token){
    try {
      token = jwt.verify(req.cookies.token, secretString.appsSecret);
    } catch (err) {
      res.sendStatus(401);
      return;
    }
    if(sessions[token.sessionId]){
      req.session = sessions[token.sessionId];
    } else {
      res.sendStatus(401);
      return;
    }
  }
  switch (req.url) {
    case '/login':
    case '/registration':
      res.createSession = (data)=>{
        let id = '_' + Math.random().toString(36).substr(2, 9);
        sessions[id] = {email:data.email, id:data.id};
        res.cookie('token', jwt.sign({sessionId:id}, secretString.appsSecret));
        fs.appendFile('log.txt', `[${Date.now()}]User: ${data.email} logged\n`, (err) => {});
      };
      break;
    case '/signout':
    case '/deleteacc':
      res.deleteSession = ()=>{
        res.clearCookie('token');
        fs.appendFile('log.txt', `[${Date.now()}]user: ${req.session.email} logged out\n`, (err) => {});
        delete sessions[token.sessionId];
      }
      break;
  }
  next();
};

setInterval(()=>{
  Session.update({}, {
    $set:{
      'sessions': sessions
    }
  }, (err, data)=>{});
}, 3000);
