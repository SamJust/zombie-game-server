const mongoose = require('mongoose');

let Formulas = mongoose.model("formulas");

module.exports = (app)=>{
  app.get('/formulas', (req, res)=>{
     Formulas.find({}, (err, data)=>{
        if(err) res.sendStatus(500);
        else res.json(data);
    });
  });
};
