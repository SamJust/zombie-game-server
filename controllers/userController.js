const mongoose = require('mongoose');

let User = mongoose.model('users');

module.exports = (app)=>{
    app.post('/lastlocation', (req, res)=>{
      User.findByIdAndUpdate(req.session.id, {
        $set:{
          "lastLocation":req.body.lastLocation
        }
      }, (err, data)=>{
        if(err){
          console.log(err.mess);
          res.sendStatus(500);
        }
        else res.sendStatus(200);
      });
    });

    app.post('/deleteacc', (req, res)=>{
      User.findByIdAndRemove(req.session.id).then(data => {
        res.deleteSession();
        res.end();
      }).catch(err => {
        res.sendStatus(500);
      });
    });
};
