const SMS_ACCOUNT_ID = process.env.SMS_ACCOUNT_ID;
const SMS_AUTH_TOKEN = process.env.SMS_AUTH_TOKEN;
const SMS_FROM = process.env.SMS_FROM;

import twilio from 'twilio';

const client = twilio(SMS_ACCOUNT_ID, SMS_AUTH_TOKEN);


export async function sendMessage(to, message) {
    const sms = await client.messages.create({
        body: message,
        from: SMS_FROM,
        to: to
    });

    return {success: true, sid: sms.sid};
}