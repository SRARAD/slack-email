var mailin = require('mailin');
var fs = require('fs');
var request = require('request');
    
/* Start the Mailin server. The available options are:
 *  options = {
 *     port: 25,
 *     webhook: 'http://mydomain.com/mailin/incoming,
 *     disableWebhook: false,
 *     logFile: '/some/local/path',
 *     logLevel: 'warn', // One of silly, info, debug, warn, error
 *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
 *        SMTPBanner: 'Hi from a custom Mailin instance'
 *     }
 *  };
 * Here disable the webhook posting so that you can do what you want with the
 * parsed message. */
mailin.start({
	port: 25,
	disableWebhook: true // Disable the webhook posting.
});

/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
		/* connection = {
			from: 'sender@somedomain.com',
			to: 'someaddress@yourdomain.com',
			id: 't84h5ugf',
			authentication: { username: null, authenticated: false, status: 'NORMAL' }
		}
	}; */
});

/* Event emitted after a message was received and parsed. */
mailin.on('message', function (connection, data, content) {
	var slackUrl = fs.readFileSync('webhook.txt').toString();
	var slackData = {
		text: data.text
	};
	console.log(slackData);
	request.post(
		slackUrl,
		function (error, response, body) {
			console.log(body)
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}
	).form({
		payload: JSON.stringify(slackData)
	});
});
