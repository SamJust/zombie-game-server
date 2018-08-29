// - энергия
// - кости
// - мозги
// - желудок
// - сердце
// - печень

let User = require('../models/userModel');

module.exports = {
  GetResources: async (req, res)=>{
    const data = await User.GetUserResources(req.session._id);
    if(!data){
      res.sendStatus(404);
    } else {
      res.json(data._doc.resources);
    }
  },

  PostResources: async (req, res)=>{
    await User.UpdateUserResources(req.session._id, req.body);
    req.session.resources = req.body;
    res.sendStatus(200);
  }
};
