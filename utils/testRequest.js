const request = require('request');

module.exports = (url) => {
    return {

        statusCode: 200,

        expectedStatusCode (code){
            this.statusCode = code;
            return this;
        },

        expectedResponseType(type){
            this.responseType = type;
            return this;
        },

        expectedResponseObject(object){
            this.responseObject = object;
            return this;
        },

        expectedResponseBody(body){
            this.responseBody = body;
            return this;
        },

        setDescription(description){
            this.description = description;
            return this;
        },

        exec () {
            return new Promise((resolve, reject)=>{
                request(url, (err, httpResponse, data)=>{
                    if(err) reject(err);
                    
                    const { responseObject, responseType, statusCode,
                            responseBody, description } = this;
                    

                    if(httpResponse.headers["content-type"] && 
                       httpResponse.headers["content-type"].includes('application/json')){
                        data = JSON.parse(data);
                    }

                    if(httpResponse.statusCode !== statusCode) return reject(`Status codes didn't match! ${description} \n Expected: ${statusCode}. Got: ${httpResponse.statusCode}`);

                    if(responseType){
                        if(typeof data !== responseType) return reject(`Wrong type of data returned. ${description} \n Expected: ${responseType}. Got: ${typeof data}`);
                    }

                    if(responseObject){
                        for (const key in responseObject) {
                            if (responseObject.hasOwnProperty(key)) {
                                if(typeof data[key] !== responseObject[key]) return reject(`Type of ${key} didn't match. ${description} \n Expected: ${responseObject[key]}. Got: ${typeof data[key]}`)
                            }
                        }
                    }

                    if(responseBody){
                        if(data !== responseBody) return reject(`The response body was unexpected. ${description} \n Expected: ${responseBody}. Got: ${data}`);
                    }

                    console.log(`${description} -- done!`)
                    resolve(httpResponse);
                });
            })
        }
    }
};