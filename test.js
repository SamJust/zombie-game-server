const request = require('./utils/testRequest')
    , mongoose = require('mongoose');

const app = require('./config/app.js');


mongoose.connect("mongodb://admin:admin@ds231559.mlab.com:31559/zombie-game-app").then(
    ()=>{
        console.log("Succefull connection to DB");
        const server = app.listen(3000, async () => {
            console.log(`Server for test's on port ${3000}`);
            
            await request({
                url: 'http://localhost:3000/api/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email: 'testuser@test.test',
                    password: 'samjust'
                })
            })
                .statusCode(404)
                .exec();
        
            server.close(() => console.log('close'));
        });
    },
    ()=>{
        console.log("Something wrong with DB");
    }
);  