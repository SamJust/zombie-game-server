const mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
  sessions: Object
});

const Sessions = mongoose.model('sessions', modelSchema);

module.exports = {
  Update: sessions => {
    Sessions.update({}, {
      $set:{
        'sessions': sessions
      }
    }).exec();
  },

  GetSessions: () => Sessions.findOne({})
};
