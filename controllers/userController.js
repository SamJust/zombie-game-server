const mongoose = require('mongoose');

let User = mongoose.model('users');

module.exports = (app)=>{
    app.post('/lastlocation', (req, res)=>{
      User.findByIdAndUpdate(req.session._id, {
        $set:{
          "lastLocation":req.body.lastLocation
        }
      }).then(data=>{
        req.session.lastLocation = req.body.lastLocation;
        res.sendStatus(200);
      }).catch(err=>{
        console.log(err.mess);
        res.sendStatus(500);
      });
    });

    app.post('/deleteacc', (req, res)=>{
      User.findByIdAndRemove(req.session._id).then(data => {
        res.deleteSession();
        res.end();
      }).catch(err => {
        res.sendStatus(500);
      });
    });
};
