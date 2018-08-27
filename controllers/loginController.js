const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let User = mongoose.model('users');

module.exports = {
  PostLogin: async (req, res)=>{
    const data = await User.findOne({email:req.body.email}).exec();
    if(!data){
      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      fs.appendFile('log.txt', `[${Date.now()}] somebody tried to login wih unexisting email ip: ${ip} email: ${req.body.email}\n`, (err) => {});
      res.sendStatus(404);
      return;
    }
    bcrypt.compare(req.body.password, data.password, (err, result)=>{
      if(result){
        res.createSession(data);
        res.json({
          nickname: data.nickname,
          resources: data.resources,
          skeletons: data.skeletons,
          knownFormulas: data.knownFormulas,
          lastLocation: data.lastLocation,
          army:data.army,
          lvl:data.lvl,
          exp:data.exp,
          maxArmy:data.maxArmy,
        });
      }
      else{
        let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        fs.appendFile('log.txt', `[${Date.now()}] somebody tried to login wih email: ${req.body.email} from ip: ${ip}\n`, (err) => {});
        res.sendStatus(404);
      }
    });
  },

  GetSignout: async (req, res)=>{
    await res.deleteSession();
    res.sendStatus(200);
  }
};
