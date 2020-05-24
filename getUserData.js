// Include the AWS SDK module
const AWS = require('aws-sdk');
// Instantiate a DynamoDB document client with the SDK
let dynamodb = new AWS.DynamoDB.DocumentClient();

// Define handler function, the entry point to our code for the Lambda service
// We receive the object that triggers the function as a parameter
exports.handler = async (event) => {
    // Extract values from event and format as strings
    let email = JSON.stringify(`${event.email}`);
    // Create JSON object with parameters for DynamoDB and store in a variable
    let params = {
        TableName:'HealthAwareTable',
        Key: {
            'email': email
        }
    };
        const data = await dynamodb.get(params).promise();
        const newLine = "<br>";
        const name = ("Name: " + data.Item.name);
        const getEmail = ("Email: " + data.Item.email);
        const bmi = Math.round(data.Item.bmi * 100) / 100;
        const bmiReturn = ("BMI: " + bmi);
        const health = ("Health Score: " + data.Item.percentage);
        const responseBody = name + newLine + getEmail + newLine + bmiReturn + newLine + health;
        const response = {
            statusCode: 200,
            body: responseBody
        };
    // Return the response constant
    return response;
}