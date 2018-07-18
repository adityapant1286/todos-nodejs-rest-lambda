'use strict'

const uuid = require('uuid');
const AWS = require('aws-sdk');
const util = require('../util/util');

const ERRORS = ["Invalid category.", "Error in creating category."];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {

    const data = JSON.parse(event.body);

    if(!data.name || typeof data.name !== 'string') {
        console.error(ERRORS[0]);
        callback(new Error(ERRORS[0]));
        return;
    }

    addToDB(data.name, callback);
};

const addToDB = (categoryName, callback) => {
    const timestamp = util.currentDate();

    const params = {
        TableName: process.env.CATEGORIES_TABLE,
        Item: {
            id: uuid.v1(),
            name: categoryName,
            createdOn: timestamp,
            updatedOn: timestamp
        }
    };

    dynamoDb.put(params, (error) => {

        if(error) {
            console.error(ERRORS[1] + "\n" + error);
            callback(new Error(ERRORS[1]));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        };

        callback(null, response);
    });
};