const mongoose = require('mongoose')
    , findSkeleton = require('../utils/findSkeleton.js')
    , modifySession = require('../utils/modifySession.js');

let Formulas = mongoose.model("formulas")
  , User = mongoose.model("users");

function checkResources (targetResources, currentResources) {
  for (var property in targetResources) {
    if (targetResources.hasOwnProperty(property)) {
      if(targetResources[property] > currentResources[property]) return false;
    }
  }
  return true;
}

function withdrawResources (targetResources, currentResources) {
  for (var property in targetResources) {
    if (targetResources.hasOwnProperty(property)) {
       currentResources[property] -= targetResources[property];
    }
  }
}

module.exports = (app)=>{
  app.get('/formulas', (req, res)=>{
     Formulas.find({}, (err, data)=>{
        if(err) res.sendStatus(500);
        else res.json(data);
    });
  });

  app.post('/formulas', (req, res)=>{
    if(req.session.knownFormulas.findIndex(formula => formula._id === req.body.item) === -1) return res.sendStatus(462);
    Formulas.findById(req.body.item).then(data => {
      if(!checkResources(data.resources, req.session.resources)) return res.sendStatus(460);
      let skeletonLoaction = findSkeleton(req.session.skeletons, data.skeletonType, 1);
      if(!skeletonLoaction) return res.sendStatus(461);
      if(req.session.army.length >= req.session.maxArmy) return res.sendStatus(463);
      withdrawResources(data.resources, req.session.resources);
      let newUnit = {
        _id: data._id,
        name: data.name,
        stats: data._doc.stats
      };
      req.session.skeletons[skeletonLoaction.i].integrety.splice(skeletonLoaction.a, 1);
      req.session.army.push(newUnit);
      User.findByIdAndUpdate(req.session._id, {
        $set:{
          skeletons: req.session.skeletons,
          resources: req.session.resources
        },
        $push:{
          army: newUnit
        }
      }).then(data => {
        res.json(modifySession(req.session));
      });
    }).catch(err => {
      console.log(err.message);
      res.sendStatus(500);
    });
  });
};
