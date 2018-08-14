const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let User = mongoose.model('users');
let Formula = mongoose.model('formulas');

module.exports = (app)=>{

  app.post('/registration', (req, res)=>{
    const emailRegExp = new RegExp(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/, 'i');
    if(!emailRegExp.test(req.body.email)) return res.sendStatus(400);
    User.findOne({email:req.body.email}).then((data)=>{
      if(!data){
        bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
          User.create({
            nickname: req.body.nickname,
            email: req.body.email,
            password: hash,
            resources: {
                energy: 0,
                brains: 0,
                heartMuscles: 0,
                livers: 0,
                corpses: 0
            },
            army: [],
            skeletons: [{
                type: 'rat',
                integrety: [0.5]
              },
              {
                type: 'bat',
                integrety: [0.7]
              }
            ],
            knownFormulas:[{
                name:'bat',
                date: 0
              },
              {
                name:'ogre',
                date:1
            }],
            lastLocation: '/'
          }).then( data =>{
            res.createSession(data);
            res.status(201).json({
              nickname: data.nickname,
              resources: data.resources,
              skeletons: data.skeletons,
              knownFormulas: data.knownFormulas,
              lastLocation: data.lastLocation,
              army: data.army
            });
          }).catch( err => {
            throw err;
          });
        });
      }
      else res.sendStatus(409);
    }).catch( err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

};
