const request = require('./utils/testRequest')
    , mongoose = require('mongoose');

const app = require('./config/app.js');

const localhost = 'http://localhost:3000';

const testUser = {
    email: 'testuser@samjust.com',
    nickname: 'testUser',
    password: 'samjust'
};


mongoose.connect("mongodb://admin:admin@ds231559.mlab.com:31559/zombie-game-app").then(
    ()=>{
        console.log("Succefull connection to DB");
        const server = app.listen(3000, async () => {
            console.log(`Server for test's on port ${3000}`);
            
            // An invalid login/pass test
            await request({
                url: `${localhost}/api/login`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            })
                .setDescription('Check what if user is not registrated')
                .expectedStatusCode(404)
                .exec();

            // Email doesn't pass validation        
            await request({
                url:`${localhost}/api/registration`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email:'wrongEmail.com',
                    nickname: testUser.nickname,
                    password: testUser.password
                })
            })
                .setDescription('Check what if email is invalid')
                .expectedResponseBody('emailNoMatchCriteria')
                .exec();

            // Nickname is too short        
            await request({
                url:`${localhost}/api/registration`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email:testUser.email,
                    nickname: '2s',
                    password: testUser.password
                })
            })
                .setDescription('Check what if nickname is too short')
                .expectedResponseBody('usernameNoMatchCriteria')
                .exec();

            // Nickname is too long        
            await request({
                url:`${localhost}/api/registration`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email:testUser.email,
                    nickname: 'itsJustAVeryVeryLongCameCasedStringIMPuttingHereCauseWellINeedOne',
                    password: testUser.password
                })
            })
                .setDescription('Check if nickname is too long')
                .setDescription('Check what if nickname is too long')
                .expectedResponseBody('usernameNoMatchCriteria')
                .exec();    

            // Password is too short        
            await request({
                url:`${localhost}/api/registration`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email:testUser.email,
                    nickname: testUser.nickname,
                    password: '12345'
                })
            })
                .setDescription('Check what if password is too short')
                .expectedResponseBody('passwordNoMatchCriteria')
                .exec();
                
            // Password is too long        
            await request({
                url:`${localhost}/api/registration`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email:testUser.email,
                    nickname: testUser.nickname,
                    password: 'aVeryVeryVeryVeryVeryVeryLongLongLongLongLongPassword'
                })
            })
                .setDescription('Check what if password is too long')
                .expectedResponseBody('passwordNoMatchCriteria')
                .exec();    

            // Successful registration            
            // await request({
            //     url:`${localhost}/api/registration`,
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body:JSON.stringify({
            //         email:testUser.email,
            //         nickname: testUser.nickname,
            //         password: testUser.password
            //     })
            // }).exec();
        
            server.close(() => console.log('close'));
        });
    },
    ()=>{
        console.log("Something wrong with DB");
    }
);  