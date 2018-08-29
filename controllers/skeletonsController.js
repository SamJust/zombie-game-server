const findSkeleton = require('../utils/findSkeleton.js')
    , modifySession = require('../utils/modifySession.js');

const User = require('../models/userModel');

module.exports = {

  PostSkeletons: async (req, res)=>{
    let index = req.session.skeletons.findIndex(item => item.type === req.body.type);
    if(index === -1){
      const newSkeletons = {
        type: req.body.type,
        integrety: [
          req.body.integrety
        ]
      };
      req.session.skeletons.push(newSkeletons);
      await User.AddNewSkeleton(req.session._id, newSkeletons);
      res.status(201).json(modifySession(req.session));
    } else {
      const field = `skeletons.${index}.integrety`;
      req.session.skeletons[index].integrety.push(req.body.integrety);
      await User.AddSpecificSkeleton(req.session._id, field, req.body.integrety);
      res.status(201).json(modifySession(req.session));
    }
  },

  PatchSkeletons: async (req, res)=>{
    const { a, b } = req.body;
    let checkA = findSkeleton(req.session.skeletons, a.type, a.integrety);
    let checkB = findSkeleton(req.session.skeletons, b.type, b.integrety);
    if(!checkA && !checkB) return res.sendStatus(400);
    req.session.skeletons[a.i].integrety.splice(a.a, 1);
    req.session.skeletons[b.i].integrety.splice(b.a, 1);
    let targetIntegrety = (a.integrety + b.integrety > 1)? 1 : a.integrety + b.integrety;
    let index = req.session.skeletons.findIndex(item => item.type === req.body.type);
    if(index === -1) {
      req.session.skeletons.push(req.body);
      await User.AddNewSkeleton(req.session._id, {
        type: req.body.targetType,
        integrety: [ targetIntegrety ]
      });
      res.sendStatus(201);      
    } else {
      const field = `skeletons.${index}.integrety`;
      req.session.skeletons[index].integrety.push(req.body.integrety);
      await User.AddSpecificSkeleton(req.session._id, field, targetIntegrety);
      res.status(201).json(modifySession(req.session));
    }
  }
};
