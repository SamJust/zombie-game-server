const request = require('request');

module.exports = (url) => {
    let responseType, statusCode,
        responseObject;
    const testRequest = {

        statusCode: (code) => {
            statusCode = code;
            return testRequest;
        },

        responseType: (type)=>{
            responseType = type;
            return testRequest;
        },

        responseObject: (object) => {
            responseObject = object;
            return testRequest;
        },

        exec: () => new Promise((resolve, reject)=>{
            request(url, (err, headers, data)=>{
                if(err) reject(err);                

                if(headers.headers["content-type"].includes('application/json')){
                    data = JSON.parse(data);
                }

                if(statusCode){
                    if(headers.statusCode !== statusCode) reject(`Status codes didn't match!`)
                }

                if(responseType){
                    if(typeof data !== responseType) reject(`Wrong type of data returned`);
                }

                if(responseObject){
                    for (const key in responseObject) {
                        if (responseObject.hasOwnProperty(key)) {
                            if(typeof data[key] !== responseObject[key]) reject(`Type of ${key} didn't match`)
                        }
                    }
                }

                resolve(headers, data);
            });
        })
    }
    return testRequest;
};