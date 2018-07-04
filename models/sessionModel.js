const mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
  sessions: Object
});

mongoose.model('sessions', modelSchema);
