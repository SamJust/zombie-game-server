const mongoose = require('mongoose')
    , jwt = require('jsonwebtoken');

const secretString = require('../../config/config.json');

let sessions = {};

let Session = mongoose.model('sessions')
  , User    = mongoose.model('users');

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
        sessions[id] = {
          email:data.email,
          id:data.id,
          startDate: Date.now()
        };
        res.cookie('token', jwt.sign({sessionId:id}, secretString.appsSecret));
      };
      break;
    case '/signout':
    case '/deleteacc':
      res.deleteSession = ()=>{
        req.session.endDate = Date.now();
        return User.findByIdAndUpdate(req.session.id, {
          $push: {
             sessions:req.session
          }
        }).then(()=>{
          res.clearCookie('token');
          delete sessions[token.sessionId];
        }).catch(err =>{
          console.log(err.message);
        });
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
