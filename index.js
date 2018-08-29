const app = require('./config/app.js')
    , mongoose = require('mongoose')
    , PORT = process.env.PORT || 3001;

mongoose.connect("mongodb://admin:admin@ds231559.mlab.com:31559/zombie-game-app").then(
    ()=>{
        console.log("Succefull connection to DB");
        app.listen(PORT, ()=>{
            console.log(`Listening to port ${PORT}`);
        });
    },
    ()=>{
        console.log("Something wrong with DB");
    }
);    