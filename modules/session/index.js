const jwt = require('jsonwebtoken');

const secretString = require('../../config/config.json');

let Session = require('./sessionModel')
  , User    = require('../../models/userModel');

module.exports = function () {
  const sessions = {};

  Session.GetSessions().then(data=>{
    data && Object.assign(sessions, data.sessions);
    console.log('Sessions loaded');
    setInterval(()=>{
      Session.Update(sessions);
    }, 3000);
  }).catch(err => console.log(err.message));  

  return (req, res, next)=>{
    let token = {};
    if(req.cookies.token){
      try {
        token = jwt.verify(req.cookies.token, secretString.appsSecret);
      } catch (err) {
        res.sendStatus(401);
        return;
      }
      if(token.sessionId in sessions){
        req.session = sessions[token.sessionId];
      } else {
        res.sendStatus(401);
        return;
      }
    }
    switch (req.url) {
      case '/api/login':
      case '/api/registration':
        res.createSession = (data)=>{
          let id = '_' + Math.random().toString(36).substr(2, 9);
          sessions[id] = {
            army:data._doc.army,
            skeletons:data._doc.skeletons,
            knownFormulas:data._doc.knownFormulas,
            resources:data._doc.resources,
            lastLocation:data._doc.lastLocation,
            lvl:data._doc.lvl,
            experience:data._doc.experience,
            maxArmy:data._doc.maxArmy,
            _id:data._doc._id,
            startDate: Date.now()
          };
          delete sessions[id].sessions;
          res.cookie('token', jwt.sign({sessionId:id}, secretString.appsSecret));
        };
        break;
      case '/api/signout':
      case '/api/deleteacc':
        res.deleteSession = async ()=>{
          req.session.endDate = Date.now();
          await User.AddSession(req.session._id, req.session);
          res.clearCookie('token');
          delete sessions[token.sessionId];
        }
        break;
    }
    next();
  }
};
