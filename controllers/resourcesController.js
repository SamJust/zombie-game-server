// - энергия
// - кости
// - мозги
// - желудок
// - сердце
// - печень

const mongoose = require('mongoose');

let User = mongoose.model('users');

module.exports = (app)=>{
  app.get('/resources', (req, res)=>{
    User.findById(req.session.id, {resources:1, _id:0}, (err, data)=>{
      if(!data){
        res.sendStatus(404);
      } else {
        res.json(data._doc.resources);
      }
    });
  });

  app.post('/resources', (req, res)=>{
    User.findByIdAndUpdate(req.session.id, {
      $set:{
        resources:req.body
      }
    }, (err, data)=>{
      if(err) res.sendStatus(500);
      else res.sendStatus(200);
    });
  });
};
