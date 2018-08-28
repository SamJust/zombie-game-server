const mongoose = require('mongoose')
    , jwt = require('jsonwebtoken');

const secretString = require('../../config/config.json');

let sessions = {};

let Session = require('../../models/sessionModel')
  , User    = require('../../models/userModel');

Session.GetSessions().then(data=>{
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
          army:data._doc.army,
          skeletons:data._doc.skeletons,
          knownFormulas:data._doc.knownFormulas,
          resources:data._doc.resources,
          lastLocation:data._doc.lastLocation,
          lvl:data._doc.lvl,
          exp:data._doc.exp,
          maxArmy:data._doc.maxArmy,
          _id:data._doc._id,
          startDate: Date.now()
        };
        delete sessions[id].sessions;
        res.cookie('token', jwt.sign({sessionId:id}, secretString.appsSecret));
      };
      break;
    case '/signout':
    case '/deleteacc':
      res.deleteSession = ()=>{
        req.session.endDate = Date.now();
        return User.findByIdAndUpdate(req.session._id, {
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
  Session.Update(sessions, (err, data)=>{});
}, 3000);
