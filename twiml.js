
	
// Require the twilio and HTTP modules
var twilio = require('twilio'),
    http = require('http');
// Create an HTTP server, listening on port 1337
http.createServer(function (req, res) {
    // Create a TwiML response and a greeting
    var resp = new twilio.TwimlResponse();
    resp.say({voice:'woman'}, 'Welcome to Acme Corporation!');
    // The <Gather> verb requires nested TwiML, so we pass in a function
    // to generate the child nodes of the XML document
    resp.gather({ timeout:30 }, function() {
        // In the context of the callback, "this" refers to the parent TwiML
        // node. The parent node has functions on it for all allowed child
        // nodes. For <Gather>, these are <Say> and <Play>.
        this.say('For sales, press 1. For support, press 2.');
    });
    //Render the TwiML document using "toString"
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
}).listen(1337);
console.log('Visit http://localhost:1337/ in your browser to see your TwiML document!');

