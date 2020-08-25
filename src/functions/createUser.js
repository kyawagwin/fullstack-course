"use strict";
const AWS = require("aws-sdk");

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);
  const username = body.username;
  const password = body.password;
  const newUserParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      pk: username,
      password: password,
    },
  };

  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const putResult = await dynamodb.put(newUserParams).promise();
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Authorization",
      },
      body: JSON.stringify({ result: putResult }),
    };
  } catch (putError) {
    console.log("There was an error putting the new item");
    console.log("putError", putError);
    console.log("newUserParams", newUserParams);
    return new Error("There was an error putting the new item");
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
};
