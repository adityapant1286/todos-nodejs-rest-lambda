'use strict'

const AWS = require('aws-sdk')

const ERRORS = ["Error in fetching users"];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {

    const params = {
        TableName: process.env.USERS_TABLE
    };

    listAll(params, callback);
};

const listAll = (params, callback) => {

    dynamoDb.scan(params, (error, result) => {

        if(error) {
            console.error(ERRORS[0] + "\n" + error);
            callback(new Error(ERRORS[0]));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        };

        callback(null, response);
    });
};