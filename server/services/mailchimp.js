const Mailchimp = require('mailchimp-api-v3');

const keys = require('../config/keys');

const { key, listKey } = keys.mailchimp;

class MailchimpService {
  init() {
    try {
      return new Mailchimp(key);
    } catch (error) {

    }
  }
}

const mailchimp = new MailchimpService().init();

// Email notification logic is a work in progress, ignore this for now
exports.subscribeToNewsletter = async email => {
  try {
    return await mailchimp.post(`lists/${listKey}/members`, {
      email_address: email,
      status: 'subscribed'
    });
  } catch (error) {
    return error;
  }
};
