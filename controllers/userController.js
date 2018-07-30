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

    app.get('/userinfo', (req, res)=>{
      if(!req.session.lvl || !req.session.exp || !req.session.maxArmy){
        User.findById(req.session._id, { _id: 0, lvl: 1, exp: 1, maxArmy: 1}).then(data=>{
          req.session.lvl = data.lvl;
          req.session.exp = data.exp;
          req.session.maxArmy = data.maxArmy;
          res.json(data);
        }).catch(err => {
          console.log(err.message);
          res.sendStatus(500);
        })
      } else {
        res.json({
          lvl: req.session.lvl,
          exp: req.session.exp,
          maxArmy: req.session.maxArmy
        });
      }
    });
};
