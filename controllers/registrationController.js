const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let User = mongoose.model('users');

module.exports = (app)=>{

  app.post('/registration', (req, res)=>{
    User.findOne({email:req.body.email}).then((data)=>{
      if(!data){
        bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
          User.create({
            nickname:req.body.nickname,
            email: req.body.email,
            password:hash,
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
          }, (err, data)=>{
            res.createSession(data);
            res.status(201).json({
              nickname: data.nickname,
              resources: data.resources,
              skeletons: data.skeletons,
              knownFormulas: data.knownFormulas,
              lastLocation: data.lastLocation,
              army: data.army
            });
          });
        });
        return;
      }
      res.sendStatus(409);
    });
  });
};
