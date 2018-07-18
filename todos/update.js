'use string'

const AWS = require('aws-sdk');
const util = require('../util/util');

const ERRORS = ["Missing or invalid input", "Unable to update todo."];

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {

    const data = JSON.parse(event.body);
    const todoId = event.pathParameters.id;
    const categoryId = getCatagoryId(event.pathParameters.categoryId);
    const userId = event.pathParameters.userId;

    if(!todoId || !userId 
        || !data.text || typeof data.text !== 'string') {
        console.error(ERRORS[0]);
        callback(new Error(ERRORS[0]));
        return;
    }

    const params = {
        TableName: process.env.TODOS_TABLE,
        Key: {
            id: todoId
        },
        ExpressionAttributeNames: {
            '#todoText' : 'text'
        },
        ExpressionAttributeValues: {
            ':text' : data.text,
            ':categoryId': categoryId,
            ':userId' : userId,
            ':checked' : data.checked,
            ':updatedOn' : util.currentDate()
        },
        UpdateExpression: 'SET #todoText = :text, categoryId = :categoryId, userId = :userId, checked = :checked, updatedOn = :updatedOn',
        ReturnValues: 'ALL_NEW'
    };

    update(params, callback);
};

const getCatagoryId = (cid) => {
    if(!cid && util.isOtherCatagoryCreated()) {
        return util.getOtherCategoryId();
    }
    return cid;
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