var mailin = require('mailin');
var fs = require('fs');
var request = require('request');

var config = require('./config');
var defaultUser = config.default;
    
mailin.start({
	port: 25,
	disableWebhook: true
});

mailin.on('message', function (connection, data, content) {
	var user = getUser(data);
	if (!user) {
		return null;
	} else {
		var token = fs.readFileSync('users/' + user).toString().replace(/(\r\n|\n|\r)/gm,"");
		var channelNames = getChannelNames(data);
		request.post(
			'https://slack.com/api/channels.list',
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var channels = JSON.parse(body).channels;
					var channelIds = channels.filter(function(d) {
						return channelNames.indexOf(d.name) != -1;
					}).map(function(d) {
						return d.id;
					});
					postFile(token, data, channelIds)
				}
			}
		).form({
			token: token
		});
	}
});

function getUser(data) {
	var from = data.from[0].address;
	var usernameArray = Object.keys(config.users).filter(function(d) {
		return config.users[d].indexOf(from.toLowerCase()) != -1;
	});
	if (usernameArray.length == 1) {
		return usernameArray[0];
	} else {
		return defaultUser;
	}
}

function getChannelNames(data) {
	var allRecipients = data.to.concat(data.cc);
	var allEmails = allRecipients.map(function(d) {
		return d.address
	});
	var validEmails = allEmails.filter(function(d) {
		return d.split('@')[1] == config.domain;
	});
	var channelNames = validEmails.map(function(d) {
		return d.split('@')[0];
	});
	return channelNames;
}

function postFile(token, data, channelIds) {
	request.post(
		'https://slack.com/api/files.upload'
	).form({
		token: token,
		content: 'From: ' + data.headers.from + '\nTo: ' + data.headers.to + '\n\n' + data.text,
		title: data.subject,
		filetype: 'txt',
		channels: channelIds.join(',')
	});
}
