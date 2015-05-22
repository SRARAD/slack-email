Slack Email
=========

**Slack-Email** is a standalone server used to integrate email with [Slack](https://slack.com/). The server allows email to be sent to a domain you set up then uploaded to Slack as a plain-text file. Emails can posted into any channel simply by sending to [channel]@mydomain.com. **Slack-Email** is built on top of [Mailin](http://mailin.io/).

## Setup

### Mailin

The first step is to setup a **Mailin** server. An Ubuntu server is recommended. The instance does not need to be very powerful, an AWS t2.micro (1GB RAM, 1 CPU) works fine.

Once the server has been created follow the [Mailin install instructions](http://mailin.io/doc) to set up **Node.js** and your **DNS**. Only follow the **Initial setup** instructions, we'll run **Mailin** slightly differently.

### Slack-Email

Once the **Mailin** dependencies have been met we can set up **Slack-Email**. To begin clone this repo somewhere on the **Mailin** server. You will run the project from the folder it lives in.

#### NPM

To update all **Node.js** dependencies run `npm update --save` in the **Slack-Email** folder.

#### Config

There is an example config file named `config.json.example`. Copy this file to `config.json` and edit it accordingly. Descriptions of the config items are below.

- **users** - This is an email mapping object used to map multiple email addresses to a single user. Create one key for each user you want recognized and place all email alias' of that user in the array. **All emails should be lowercase, Slack-Email lowercases all emails before matching the user.**
- **default** [Optional] - The default user files get posted as if no matching email address is found. Emails without a matching email address will not be posted if there is no default user.
- **allowedDomains** [Optional] - An array of allowed domains. Emails from these domains will be posted if there is a **default** user specified as the **default** user.
- **domain** - The email domain **Slack-Email** will look for on the **To** and **CC** fields.

#### API Keys

To use **Slack-Email** each user needs to obtain a personal API authentication token. Files can only be posted to Slack by people, so bots can't be used. Each user should place their API key under the `users/` directory in a file named after their username (e.g. theconnman's API key would go in `users/theconnman`).

#### Running

To run **Slack-Email** navigate to the project directory on your **Mailin** server and execute `nohup node index.js &` to run the script in the background. The log file will automatically be logged to `nohup` in the same directory.

**NOTE:** Due to an unresolved socket hangup error running the above command will die after a day or two. Please run the included wrapper script with `nohub wrapper.sh &`.

## Usage

Once your instance has been fully configured using **Slack-Email** is as easy as sending an email to (either explictly in the **To** field or by **CC**ing) [channel]@mydomain.com where [channel] is any channel you have access to. **Slack-Email** will parse out the channel name and share the email body as a plain-text file in that channel

## License

**Slack-Email** has been released under the MIT license by [SRA International, INC](https://www.sra.com/). It was originally developed specifically for the [SRA Rapid Application Development Team](https://github.com/SRARAD) and early versions contained sensitive information (e.g. email addresses, usernames, domains) which have been sanitized from the Git history. Because of this, it is recommended not to use versions of **Slack-Email** before [v1.0.0](https://github.com/SRARAD/slack-email/releases/tag/v1.0.0).
