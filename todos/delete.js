'use strict'

const AWS = require('aws-sdk');

const ERRORS = ["Missing or invalid input", "Unable to delete todo."];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {

    const todoId = event.pathParameters.id;

    if(!todoId) {
        console.error(ERRORS[0]);
        callback(new Error(ERRORS[0]));
        return;
    }
    
    const params = {
        TableName: process.env.TODOS_TABLE,
        Key: {
            id: todoId
        }
    };

    deleteIt(params, callback);
};

const deleteIt = (params, callback) => {

    dynamoDb.delete(params, (error) => {

        if(error) {
            console.error(ERRORS[1] + "\n" + error);
            callback(new Error(ERRORS[1]));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: "Requested todo item deleted" })
        };

        callback(null, response);
    });
};