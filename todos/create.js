'use strict'

const uuid = require('uuid');
const AWS = require('aws-sdk');
const util = require('../util/util');

const ERRORS = ["Missing or invalid input.", "Error in creating todo item."];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {

    const data = JSON.parse(event.body);

    if(!data.text || !data.userId
        || typeof data.text !== 'string') {
        console.error(ERRORS[0]);
        callback(new Error(ERRORS[0]));
        return;
    }

    addToDB(data, callback);
};

const getCatagoryId = (cid) => {
    if(!cid && util.isOtherCatagoryCreated()) {
        return util.getOtherCategoryId();
    }
    return cid;
};

const addToDB = (data, callback) => {
    const timestamp = util.currentDate();

    const params = {
        TableName: process.env.TODOS_TABLE,
        Item: {
            id: uuid.v1(),
            userId: data.userId,
            categoryId: getCatagoryId(data.catagoryId),
            text: data.text,
            checked: false,
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