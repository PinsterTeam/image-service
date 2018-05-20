'use strict';

const _ = require('lodash');
const util = require('util');
const request = require('request');

module.exports = class PinsterApiClient {
    constructor(pinsterUrl, authToken) {
        this.pinsterUrl = _.isUndefined(pinsterUrl) ? process.env.PINSTER_API_URL : pinsterUrl;
        this.authToken = _.isUndefined(authToken) ? process.env.AUTH_TOKEN : authToken;
    }

    createImage(imageParameters, callback) {
        if (_.isUndefined(this.authToken)) {
            callback('Secret fetching failed!');
        }
        else {

            const requestParams = {
                method: 'POST',
                uri: `${this.pinsterUrl}/v1/images`,
                headers: {
                    'Authorization': 'Bearer ' + this.authToken
                },
                body: imageParameters
            };
            console.log(util.inspect(requestParams, {depth: 5}));

            request(requestParams, (err, response, body) => {
                if (err) {
                    console.log(util.inspect(err, {depth: 5}));
                    callback(err);
                }
                else {
                    console.log(util.inspect(response, {depth: 5}));
                    console.log(util.inspect(body, {depth: 5}));
                    if (response.statusCode !== 200) {
                        callback(`Api called due to non 200 status. ${response}, ${body}`);
                    }
                    else {
                        callback(undefined, response, body);
                    }
                }
            });
        }
    }

    createFailureNotification(notificationParameters, callback) {
        request.post({
            url: `${this.pinsterUrl}/v1/notifications/failure`,
            headers: {
                'Authorization': this.authToken
            }
        }, notificationParameters, (err, response, body) => {
            if (err) {
                console.log(util.inspect(err, {depth: 5}));
                callback(err);
            }
            else {
                console.log(util.inspect(response, {depth: 5}));
                console.log(util.inspect(body, {depth: 5}));
                callback(undefined, response, body);
            }
        });
    }
};
