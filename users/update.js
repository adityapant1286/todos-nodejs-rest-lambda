'use string'

const AWS = require('aws-sdk');
const util = require('../util/util');

const ERRORS = ["Invalid input", "Unable to update user."];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {

    const data = JSON.parse(event.body);
    const userId = event.pathParameters.id;

    if(!userId || !data.name || typeof data.name !== 'string') {
        console.error(ERRORS[0]);
        callback(new Error(ERRORS[0]));
        return;
    }

    const params = {
        TableName: process.env.USERS_TABLE,
        Key: {
            id: userId
        },
        ExpressionAttributeNames: {
            '#userName' : 'name'
        },
        ExpressionAttributeValues: {
            ':name' : data.name,
            ':updatedOn' : util.currentDate()
        },
        UpdateExpression: 'SET #userName = :name, updatedOn = :updatedOn',
        ReturnValues: 'ALL_NEW'
    };

    update(params, callback);
};

const update = (params, callback) => {

    dynamoDb.update(params, (error, result) => {

        if(error) {
            console.error(ERRORS[1] + "\n" + error);
            callback(new Error(ERRORS[1]));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes)
        };

        callback(null, response);
    });
};