const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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
  exp: Number,
  maxArmy: Number
});

mongoose.model('users', userSchema);
