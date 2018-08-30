const request = require('../utils/testRequest');
const testConfig = require('../config/config-test.json');

async function loginAndRegistration (testUser) {
    // An invalid login/pass test
    await request({
        url: `${testConfig.localhost}/api/login`,
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
        url:`${testConfig.localhost}/api/registration`,
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
        .expectedStatusCode(400)
        .expectedResponseBody('emailNoMatchCriteria')
        .exec();

    // Nickname is too short        
    await request({
        url:`${testConfig.localhost}/api/registration`,
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
        .expectedStatusCode(400)
        .expectedResponseBody('usernameNoMatchCriteria')
        .exec();

    // Nickname is too long        
    await request({
        url:`${testConfig.localhost}/api/registration`,
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
        .setDescription('Check what if nickname is too long')
        .expectedStatusCode(400)
        .expectedResponseBody('usernameNoMatchCriteria')
        .exec();    

    // Password is too short        
    await request({
        url:`${testConfig.localhost}/api/registration`,
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
        .expectedStatusCode(400)
        .expectedResponseBody('passwordNoMatchCriteria')
        .exec();
        
    // Password is too long        
    await request({
        url:`${testConfig.localhost}/api/registration`,
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
        .expectedStatusCode(400)
        .expectedResponseBody('passwordNoMatchCriteria')
        .exec();    

    // Successful registration            
    const registrationResponse = await request({
        url:`${testConfig.localhost}/api/registration`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email:testUser.email,
            nickname: testUser.nickname,
            password: testUser.password
        })
    })
        .setDescription('Registrate new user')
        .expectedStatusCode(201)
        .exec();
    
    const firstToken = registrationResponse
                               .headers['set-cookie']
                               .find(item => item.includes('token'))
                               .split(';')[0]
                               .split('=')[1];
    
    await request({
        url:`${testConfig.localhost}/api/signout`,
        method: 'POST',
        headers: {
                cookie: `token=${firstToken};`
        }
    })
        .setDescription('Signout user from system')
        .exec();
    
    const loginResponse = await request({
        url:`${testConfig.localhost}/api/login`,
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
    })
        .setDescription('Login user to the system')
        .expectedResponseType('object')
        .exec();

    return loginResponse
                        .headers['set-cookie']
                        .find(item => item.includes('token'))
                        .split(';')[0]
                        .split('=')[1]; 
}

module.exports = loginAndRegistration;