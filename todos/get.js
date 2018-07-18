'use strict'

const AWS = require('aws-sdk');

const ERRORS = ["Invalid todo id.", "Data fetch error."];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
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

    getById(params, callback);
};

const getById = (params, callback) => {

    dynamoDb.get(params, (error, result) => {

        if(error) {
            console.error(ERRORS[1] + "\n" + error);
            callback(new Error(ERRORS[1]));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        };

        callback(null, response);
    });

};