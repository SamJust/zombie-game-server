const mongoose = require('mongoose')
    , findSkeleton = require('../utils/findSkeleton.js')
    , modifySession = require('../utils/modifySession.js');

const User = mongoose.model('users');

module.exports = (app) => {

  app.post('/skeletons', (req, res)=>{
    let index = req.session.skeletons.findIndex(item => item.type === req.body.type);
    if(index === -1){
      const newSkeletons = {
        type: req.body.type,
        integrety: [
          req.body.integrety
        ]
      };
      req.session.skeletons.push(newSkeletons);
      User.findByIdAndUpdate(req.session._id, {
        $push:{
            skeletons:newSkeletons
        }
      }).then(data => {
        res.status(201).json(modifySession(req.session));
      }).catch(err => {
        console.log(err.message);
        res.sendStatus(500);
      });
    } else {
      let field = `skeletons.${index}.integrety`;
      req.session.skeletons[index].integrety.push(req.body.integrety);
      User.findByIdAndUpdate(req.session._id, {
        $push:{
            [field]:req.body.integrety
        }
      }).then(data => {
        res.status(201).json(modifySession(req.session));
      }).catch(err => {
        console.log(err.message);
        res.sendStatus(500);
      });
    }
  });

  app.patch('/skeletons', (req, res)=>{
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
      User.findByIdAndUpdate(req.session._id, {
        $push:{
            skeletons:req.body
        }
      }).then(data => {
        res.sendStatus(201);
      }).catch(err => {
        console.log(err.message);
        res.sendStatus(500);
      });
    } else {
      let field = `skeletons.${index}.integrety`;
      req.session.skeletons[index].integrety.push(req.body.integrety);
      User.findByIdAndUpdate(req.session._id, {
        $push:{
            [field]:req.body.integrety
        }
      }).then(data => {
        res.status(201).json(modifySession(req.session));
      }).catch(err => {
        console.log(err.message);
        res.sendStatus(500);
      });
    }
  });
};
