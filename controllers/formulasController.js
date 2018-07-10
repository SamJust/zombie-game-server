const mongoose = require('mongoose');

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

function findIntactSkeleton (skeletonsArray, skeletonType) {
  for(let i = 0; i < skeletonsArray.length; i++){
    for (let a = 0; a < skeletonsArray[i].integrety.length; a++) {
      if(skeletonsArray[i].type !== skeletonType) continue;
      if(skeletonsArray[i].integrety[a] === 1) return skeletonsArray[i].integrety.splice(a, 1);
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
      let skeletonLoaction = findIntactSkeleton(req.session.skeletons, data.skeletonType);
      if(!skeletonLoaction) return res.sendStatus(461);
      withdrawResources(data.resources, req.session.resources);
      let newUnit = {
        _id: data._id,
        name: data.name,
        stats: data._doc.stats
      };
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
        let response = Object.assign({}, req.session);
        delete response['startDate'];
        res.json(response);
      });
    }).catch(err => {
      console.log(err.message);
      res.sendStatus(500);
    });
  });
};
