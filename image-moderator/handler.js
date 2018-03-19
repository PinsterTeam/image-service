'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const util = require('util');

module.exports.moderate = (event, context, callback) => {
    console.log(util.inspect(event, {depth: 5}));

    let params = {
        Image: {
            S3Object: {
                Bucket: event.Bucket,
                Name: event.Key
            }
        },
        MinConfidence: 0.0
    };

    console.log(params);

    rekognition.detectModerationLabels(params).promise()
        .then(result => {
            console.log("The rekognition result:", util.inspect(result, {depth: 5}));
            callback(null, result);
        })
        .catch(err => callback(err))
};