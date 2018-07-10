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
    User.findById(req.session._id, {resources:1, _id:0}, (err, data)=>{
      if(!data){
        res.sendStatus(404);
      } else {
        res.json(data._doc.resources);
      }
    });
  });

  app.post('/resources', (req, res)=>{
    User.findByIdAndUpdate(req.session._id, {
      $set:{
        resources:req.body
      }
    }).then(data=>{
      req.session.resources = req.body;
      res.sendStatus(200);
    }).catch(err => {
      res.sendStatus(500);
    });
  });

  app.post('/skeletons', (req, res)=>{
    User.findByIdAndUpdate(req.session._id, {
      $push:{
          skeletons:req.body
      }
    }).then().catch(err => {
      console.log(err.message);
      res.sendStatus(500);
    });
  });
};
