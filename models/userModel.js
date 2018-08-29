const mongoose = require('mongoose');
const resourcesSchema = require('./resourcesSchema.js');

const userSchema = new mongoose.Schema({
  nickname: String,
  password: String,
  email: String,
  resources: Object,
  army: Array,
  skeletons: Array,
  knownFormulas: Array,
  lastLocation: String,
  sessions: Array,
  lvl: Number,
  experience: Number,
  maxArmy: Number
});

const User = mongoose.model('users', userSchema);

module.exports = {
  FindUserByEmail: (email) => User.findOne({ email }).exec(),

  FindUserBy_id: _id => User.findById(_id,).exec(),

  GetUserResources: _id => User.findById(_id, {resources:1, _id:0}).exec(),

  UpdateUserResources: (_id, resources) => User.findByIdAndUpdate(_id, {
    $set:{
      resources
    }
  }).exec(),

  AddUnit: (_id, skeletons, resources, unit) => User.findByIdAndUpdate(_id, {
        $set:{
          skeletons: skeletons,
          resources: resources
        },
        $push:{
          army: unit
        }
      }
    ).exec(),

  AddFormula: (_id, formula) => User.findByIdAndUpdate(_id, {
    $push:{
      knownFormulas: formula
    }
  }).exec(),

  CreateUser: user => User.create(user),

  AddNewSkeleton: (_id, skeletons) => User.findByIdAndUpdate(_id, {
    $push: {
      skeletons
    }
  }).exec(),

  AddSpecificSkeleton: (_id, field, integrety) => User.findByIdAndUpdate(_id, {
    $push:{
        [field]:integrety
    }
  }).exec(),

  SetLastLocation: (_id, lastLocation) => User.findByIdAndUpdate(_id, {
    $set: {
      lastLocation
    }
  }).exec(),

  DeleteUser: _id => User.findByIdAndRemove(_id).exec(),

  GetUserInfo: _id => User.findById(_id, {_id:0, maxArmy: 1, exp: 1, lvl: 1}).exec(),

  AddSession: (_id, session) => User.findByIdAndUpdate(_id,{
    $push: {
       sessions:session
    }
  }).exec()
};
