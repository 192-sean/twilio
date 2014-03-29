//Change the variables to match your information and save this file as twCreds.js
module.exports = {
  TWILIO_SID: 'TWILIO_SID_HERE',
  TWILIO_AUTHTOKEN: 'TWILIO_AUTHTOKEN_HERE',
  TWILIO_NUMBER: 'YOUR_TWILIO_NUMBER',
  TWILIO_HOSTNAME: 'htpps://YOUR_ACCOUNT.ngrok.com',
};

if(module.exports.TWILIO_SID == 'TWILIO_SID_HERE'){
  console.log('WRONG WRONG WRONG WRONG WRONG!!!!!!!');
  console.log('You forget to put your twilio creds into twCreds.js. Please do that and try again.');
}

