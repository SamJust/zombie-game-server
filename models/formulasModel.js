const mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
  name: String,
  skeletonType: String,
  resources: Object,
  img: String
});

mongoose.model('formulas', modelSchema);
