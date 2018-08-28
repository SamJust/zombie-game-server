const mongoose = require('mongoose');
const resourcesSchema = require('./resourcesSchema.js');

var formulaSchema = new mongoose.Schema({
  name: String,
  skeletonType: String,
  title: String,
  resources: resourcesSchema,
  img: String
});

const Formula = mongoose.model('formulas', formulaSchema);

module.exports = {
  GetFormulas: () => Formula.find({}).exec(),

  GetSingleFomula: (id) => Formula.findById(id).exec(),

  GetFormulaByName: (name) => Formula.findOne({ name }).exec()
};