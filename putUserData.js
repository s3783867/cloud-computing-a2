// Include the AWS SDK module
const AWS = require('aws-sdk');
// Instantiate a DynamoDB document client with the SDK
let dynamodb = new AWS.DynamoDB.DocumentClient();
// Use built-in module to get current date & time
let date = new Date();
// Store date and time in human-readable format in a variable
let now = date.toISOString();
// Define handler function, the entry point to our code for the Lambda service
// We receive the object that triggers the function as a parameter
exports.handler = async (event) => {
    // Extract values from event and format as strings
    let email = JSON.stringify(`${event.email}`);
    let name = JSON.stringify(`${event.firstName} ${event.lastName}`);
    //bmi BMI = weight (kg) / [height (m)]2
    var weight = Number(event.weight);
    var height = Number(event.height);
    var bmi = weight / (height*height);
    var bmiScore = 0;
    if(bmi > 30 || bmi < 18.5){
        bmiScore = 1;
    } else{
        bmiScore = 5;
    }
    let bmiJSON = JSON.stringify(bmi);
    //overall health out of 25 calculator ) (%)
    var exercise = Number(event.exercise);
    var diet = Number(event.diet);
    var sleep = Number(event.sleep);
    var smoker = Number(event.smoker);
    var total = exercise + diet + sleep + smoker + bmiScore;
    var percentage = (total/25)*100 + "%";
    let percentageJSON = JSON.stringify(percentage);
    
    // Create JSON object with parameters for DynamoDB and store in a variable
    let params = {
        TableName:'HealthAwareTable',
        Item: {
            'email': email,
            'name' : name,
            'inputTime': now,
            'bmi': bmiJSON,
            'percentage': percentageJSON
        }
    };
    // Using await, make sure object writes to DynamoDB table before continuing execution
    await dynamodb.put(params).promise();
    // Create a JSON object with our response and store it in a constant
    const response = {
        statusCode: 200,
        body: "Form submitted for: " + name
    };
    // Return the response constant
    return response;
}