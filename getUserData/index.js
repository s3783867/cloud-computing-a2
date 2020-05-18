'use strict'
const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-1"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB();
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

    let responseBody = "";
    let statusCode = 0;

    const {email} = event.pathParameters;


    const params = {
        TableName: "HealthAwareTable",
        Key: {
            email: email
        }
    }
    try{
        const data =  await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    } catch(err) {
        responseBody = "Unable to get user data";
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "test"
        },
        body: responseBody
    }

    return response;
    
}