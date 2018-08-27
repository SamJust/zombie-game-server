const mongoose = require('mongoose');

let User = mongoose.model('users');

module.exports = {
  PostLastLocation: async (req, res)=>{
    await User.findByIdAndUpdate(req.session._id, {
      $set:{
        "lastLocation":req.body.lastLocation
      }
    })
    req.session.lastLocation = req.body.lastLocation;
    res.sendStatus(200);
  },

  PostDeleteAcc: async (req, res)=>{
    await User.findByIdAndRemove(req.session._id).exec();
    res.deleteSession();
    res.end();
  },

  GetUserInfo: async (req, res)=>{
    if(!req.session.lvl || !req.session.exp || !req.session.maxArmy){
      await User.findById(req.session._id, { _id: 0, lvl: 1, exp: 1, maxArmy: 1}).exec();
      req.session.lvl = data.lvl;
      req.session.exp = data.exp;
      req.session.maxArmy = data.maxArmy;
      res.json(data);
    } else {
      res.json({
        lvl: req.session.lvl,
        exp: req.session.exp,
        maxArmy: req.session.maxArmy
      });
    }
  }
};
