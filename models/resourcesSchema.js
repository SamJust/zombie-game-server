const mongoose = require('mongoose');

const resourcesShema = new mongoose.Schema({
    "energy" : Number,
    "brains" : Number,
    "heartMuscles" : Number,
    "livers" : Number,
    "corpses" : Number
});

module.exports = resourcesShema;