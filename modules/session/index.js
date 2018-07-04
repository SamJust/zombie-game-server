const mongoose = require('mongoose')
    , jwt = require('jsonwebtoken');

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
      res.json('invalidToken');
      return;
    }

    if(!sessions[token.sessionId]){
      res.json('invalidToken');
      return;
    }
    req.session = sessions[token.sessionId];

  } else if (req.url === '/login' || req.url === '/registration') {
    res.createSession = (data)=>{
      let id = '_' + Math.random().toString(36).substr(2, 9);
      sessions[id] = {email:data.email, id:data.id};
      res.cookie('token', jwt.sign({sessionId:id}, secretString.appsSecret));
    };
  } else {
    res.json('invalidToken');
    return;
  }

  if (req.url === '/login' || req.url === '/registration') {
    res.createSession = (data)=>{
      let id = '_' + Math.random().toString(36).substr(2, 9);
      sessions[id] = {email:data.email, id:data._id};
      res.cookie('token', jwt.sign({sessionId:id}, secretString.appsSecret));
    };
  } //making sure

  if(req.url === '/signout' || req.url === '/deleteacc'){
    res.clearCookie('token');
    delete sessions[token.sessionId];
  }
  next();
};

setInterval(()=>{
  Session.update({}, {
    $set:{
      'sessions': sessions
    }
  }, (err, data)=>{
  });
}, 3000);
