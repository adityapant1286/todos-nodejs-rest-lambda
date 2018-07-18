'use strict'

const dateFormat = require('dateformat');
const uuid = require('uuid');
const AWS = require('aws-sdk');

const OTHER_CATAGORY_ID = uuid.v1();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const DEFAULT_FORMAT = "dd-mmm-yyyy HH:MM:ss";

let otherCategoryCreated = false;

/**
 * Format current date object to specified format or
 * default format [dd-mmm-yyyy HH:MM:ss]
 *  
 * @param {string} format
 * @returns
 *  formated date
*/
module.exports.currentDate = (format) => {
    let df = DEFAULT_FORMAT;
    if(format) {
        df = format;
    }
    return dateFormat(new Date(), df);
};

module.exports.getOtherCategoryId = () => {
    return OTHER_CATAGORY_ID;
};

module.exports.isOtherCatagoryCreated = () => {
    
    if(!otherCategoryCreated) {
        otherCategoryCreated = createOtherCategory();
    }
    return otherCategoryCreated;
};

const createOtherCategory = () => {
    console.log("Creating Other category");

    const timestamp = currentDate();

    const params = {
        TableName: process.env.CATEGORIES_TABLE,
        Item: {
            id: getOtherCategoryId(),
            name: "Other",
            createdOn: timestamp,
            updatedOn: timestamp
        }
    };

    dynamoDb.put(params, (error) => {
        if(error) {
            console.error(ERRORS[1] + "\n" + error);
            return false;
        }
        
        console.log("Other category created. id=" + getOtherCategoryId());
        return true;
    });
};

