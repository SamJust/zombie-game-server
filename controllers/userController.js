let User = require('../models/userModel');

module.exports = {
  PostLastLocation: async (req, res)=>{
    // TODO: Add a check, if a player can actually move to this location
    await User.SetLasLocation(req.session._id, req.body.lastLocation)
    req.session.lastLocation = req.body.lastLocation;
    res.sendStatus(200);
  },

  PostDeleteAcc: async (req, res)=>{
    await User.DeleteUser(req.session._id);
    await res.deleteSession();
    res.end();
  },

  GetUserInfo: async (req, res)=>{
    if(!req.session.lvl || !req.session.exp || !req.session.maxArmy){
      const data = await User.GetUserInfo(req.session._id);
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
