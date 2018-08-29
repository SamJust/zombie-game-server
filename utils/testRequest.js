const request = require('request');

module.exports = (url) => {
    return {

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
                    

                    if(httpResponse.headers["content-type"].includes('application/json')){
                        data = JSON.parse(data);
                    }

                    if(statusCode){
                        if(httpResponse.statusCode !== this.statusCode) reject(`Status codes didn't match! ${description}`)
                    }

                    if(responseType){
                        console.log(responseType)
                        if(typeof data !== responseType) reject(`Wrong type of data returned. ${description}`);
                    }

                    if(responseObject){
                        for (const key in responseObject) {
                            if (responseObject.hasOwnProperty(key)) {
                                if(typeof data[key] !== responseObject[key]) reject(`Type of ${key} didn't match. ${description}`)
                            }
                        }
                    }

                    if(responseBody){
                        if(data !== responseBody) reject(`The response body was unexpected. ${description}`);
                    }

                    resolve(httpResponse, data);
                });
            })
        }
    }
};