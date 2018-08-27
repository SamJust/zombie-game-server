// - энергия
// - кости
// - мозги
// - желудок
// - сердце
// - печень

const mongoose = require('mongoose');

let User = mongoose.model('users');

module.exports = {
  GetResources: async (req, res)=>{
    const data = await User.findById(req.session._id, {resources:1, _id:0}).exec();
    if(!data){
      res.sendStatus(404);
    } else {
      res.json(data._doc.resources);
    }
  },

  PostResources: async (req, res)=>{
    await User.findByIdAndUpdate(req.session._id, {
      $set:{
        resources:req.body
      }
    }).exec();
    req.session.resources = req.body;
    res.sendStatus(200);
  }
};
