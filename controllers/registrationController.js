const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let User = mongoose.model('users');
let Formula = mongoose.model('formulas');

module.exports = {

  PostRegistration: async (req, res)=>{
    const emailRegExp = new RegExp(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/, 'i');
    const usernameRegExp = new RegExp(/^[a-zA-Z0-9]+$/);
    const passwordRegExp = new RegExp(/^[a-zA-Z0-9]+$/);
    const emptySpacesRegExp = new RegExp(/[\s]{2,}/);
    const passwordEmptySpacesRegExp = new RegExp(/[\s]{2,}/);

    if (!emailRegExp.test(req.body.email)) {
      return res.status(400).send('emailNoMatchCriteria');
    }

    if (!usernameRegExp.test(req.body.nickname) || emptySpacesRegExp.test(req.body.nickname)) {
      return res.status(400).send('usernameNoMatchCriteria');
    } else if (req.body.nickname.length < 3 || req.body.nickname.length > 36) {
      return res.status(400).send('usernameNoMatchCriteria');
    }

    if (!passwordRegExp.test(req.body.password)) {
      return res.status(400).send('passwordNoMatchCriteria');
    } else if (req.body.password.length < 6 || req.body.password.length > 32) {
      return res.status(400).send('passwordNoMatchCriteria');
    }

    const data = await User.findOne({email:req.body.email});
    if(!data){
      bcrypt.hash(req.body.password, saltRounds, async (err, hash)=>{
        if(err) return res.sendStatus(500);
        await User.create({
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
        }).exec();
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
    }
    else res.sendStatus(409);
  }
};
