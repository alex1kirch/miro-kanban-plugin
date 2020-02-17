// server.js

// init project
var express = require('express');
var path = require('path');
var axios = require('axios');
var OAuth = require('oauth').OAuth;
var config = require('./config.json');
var request = require('request');

var app = express();

var basePath = new URL(config.jiraHost.protocol + "://" + config.jiraHost.host + ":" + config.jiraHost.port)
	.toString()
	.replace(/\/+$/, '');

var consumer =
	new OAuth(
		basePath + config.paths['request-token'],
		basePath + config.paths['access-token'],
		config.oauth.consumer_key,
    // TODO: check ascii really needed?
		config.oauth.consumer_secret.toString("ascii"),
		"1.0",
		"https://miro-kanban-plugin.glitch.me/jira/callback",
		"RSA-SHA1");

function parseJsonData(data) {
	var parsedData = data;
	if (typeof data === "string" || typeof data == "object" && data.constructor === String) {
		try {
			parsedData = JSON.parse(data);
		} catch (err) {
			parsedData = data;
		}
	}
	return parsedData;
};

function rest(request, response) {
	var query = request.query.query; // /rest/api/latest/
	var method = (request.query.method || "GET").toUpperCase();
	var postData = request.body || "";

	consumer._performSecureRequest(config.oauth.access_token, config.oauth.access_token_secret,
		method,
		basePath + query, null, postData, 'application/json', function (error, data) {
			if (error) {
				console.log(error);
				response.status(400).send("Error getting data");
			} else {
				var jsonData = parseJsonData(data);
				response.json(jsonData);
			}
		});
}

function image(_request, response) {
  request.get(_request.query.url).pipe(response);
  response.header("Access-Control-Allow-Origin", "*");
}

app.use(express.static('public'));

app.get("/", function(request, response) {
  response.sendFile(__dirname + '/static/index.html');
});

app.get('/jira/rest', rest);

app.get('/jira/image', image);

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
