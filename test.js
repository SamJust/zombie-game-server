const request = require('./utils/testRequest')
    , mongoose = require('mongoose');

const loginAndRegistration = require('./tests/loginAndRegistration');

const app = require('./config/app.js');

const testConfig = require('./config/config-test.json');

const testUser = {
    email: 'testuser@samjust.com',
    nickname: 'testUser',
    password: 'samjust'
};


mongoose.connect("mongodb://admin:admin@ds231559.mlab.com:31559/zombie-game-app").then(
    ()=>{
        console.log("Succefull connection to DB");
        const server = app.listen(3000, async () => {
            console.log(`Server for tests on port ${3000}`);

            const token = await loginAndRegistration(testUser);

            await request({
                url: `${testConfig.localhost}/api/deleteacc`,
                method: 'POST',
                headers:{
                    cookie: `token=${token};`
                }
            })
                .setDescription('Delete test account from database')
                .exec();
        
            server.close(() => {
                console.log('Test server shutted down');
                process.exit(0);
            });
        });
    },
    ()=>{
        console.log("Something wrong with DB");
    }
);  