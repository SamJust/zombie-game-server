const mongoose = require('mongoose')
    , findSkeleton = require('../utils/findSkeleton.js')
    , modifySession = require('../utils/modifySession.js');

let Formulas = require('../models/formulasModel')
  , User = require('../models/userModel');

function checkResources (targetResources, currentResources) {
  for (let property in targetResources) {
    if (targetResources.hasOwnProperty(property)) {
      if(targetResources[property] > currentResources[property]) return false;
    }
  }
  return true;
}

function withdrawResources (targetResources, currentResources) {
  for (let property in targetResources) {
    if (targetResources.hasOwnProperty(property)) {
       currentResources[property] -= targetResources[property];
    }
  }
}

module.exports = {
  GetFormulas: async (req, res)=>{
    const formulas = await Formulas.GetFormulas();
    res.json(formulas);
  },

  PostFormulas: async (req, res)=>{
    if(req.session.knownFormulas.findIndex(formula => formula.name === req.body.item) === -1) return res.sendStatus(462);
    const data = await Formulas.GetSingleFormula(req.body.item);
    if(!checkResources(data.resources, req.session.resources)) return res.sendStatus(460);
    const skeletonLoaction = findSkeleton(req.session.skeletons, data.skeletonType, 1);
    if(!skeletonLoaction) return res.sendStatus(461);
    if(req.session.army.length >= req.session.maxArmy) return res.sendStatus(463);
    withdrawResources(data.resources, req.session.resources);
    const newUnit = {
      _id: data._id,
      name: data.name,
      stats: data._doc.stats
    };
    req.session.skeletons[skeletonLoaction.i].integrety.splice(skeletonLoaction.a, 1);
    req.session.army.push(newUnit);
    await User.AddUnit(req.session._id, req.session.skeletons, req.session.resources, newUnit);
    res.json(modifySession(req.session));
  },

  PutFormulas: async (req, res) => {
    if(req.session.knownFormulas.findIndex(item => item.name === req.body.name) !== -1) return res.sendStatus(409);
    const newFormula = {
      name: req.body.name,
      date: Date.now()
    };
    const data = Formulas.GetFormulaByName(name);
    if(!data) res.sendStatus(400);
    const user = await User.AddFormula(req.session._id, newFormula);
    if(!user) return res.sendStatus(400);
    req.session.knownFormulas.push(newFormula);
    res.status(201).json(req.session);
  }
};
