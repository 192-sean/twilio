var  express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , twilio = require('twilio');

//Load twilio properties
//TODO: YOU NEED TO GO INTO THIS FILE AND PASTE YOUR TWILIO CREDS
var twCreds = require('./twCreds');

var exphbs = require('express3-handlebars');

//https://demo.twilio.com/welcome/voice/

//LEAVE THE +1 at the beginning of the numbers. Otherwise, it doesn't work.
//var HOST_NUMBER = '+18016236842';
var test2NUMBER = twCreds.TWILIO_TEST2;
var test1NUMBER = twCreds.TWILIO_TEST1;
var MY_NUMBER = twCreds.TWILIO_NUMBER;
var MY_HOSTNAME = twCreds.TWILIO_HOSTNAME;
var callMeMaybe = 'http://www.youtube.com/watch?v=RWAdb1vgoik';

//console.log(test1Number + " test 2" + test2NUMBER);

// Create twilio client
var twilioClient = twilio(twCreds.TWILIO_SID, twCreds.TWILIO_AUTHTOKEN);

//get messages all messages in this account
/*twilioClient.messages.list(function(err, data) {
    data.messages.forEach(function(message) {
        console.log(message.Body);
    });
});*/

// Body parser middleware
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Start server
var port = process.env.PORT || 4567;
server.listen(port);
console.log("server listening on port " + port);


// Configure express
//app.use(express.bodyParser());
app.use("/static", express.static(__dirname + '/public'));


app.get('/', function(req, res) {
  if(req.session.clientName) {
    res.redirect('/client');
  }
  else {
    res.render('index');
  }
});

function clientRoute(req, res) {
  var capability = new twilio.Capability(
      twCreds.TWILIO_SID,
      twCreds.TWILIO_AUTHTOKEN
  );
  if(!req.session.clientName) {
    req.session.clientName = req.body.name;
  }
  capability.allowClientIncoming(req.session.clientName);
  capability.allowClientOutgoing('APdedf07986e0975ac802707f1c0a05b71');
  res.render('client', {
      token: capability.generate(),
      phone_number: MY_NUMBER
  });
}

app.post('/client', clientRoute);
app.get('/client', clientRoute);

io.sockets.on('connection', function(socket) {
  console.log('socket.io connected');
  socket.on('incoming', function(caller) {
    fullcontact.person.findByPhone(caller, "US", function(err, person) {
      var details = {
        number: caller,
        name: person.contactInfo.fullName,
        photo: person.photos[0].url
      }
      socket.emit('foundPerson', details);
    });
  });
});

app.post('/incoming', function (req, res) {
  var resp = new twilio.TwimlResponse();

  resp.dial(function() {
    this.client(req.query.clientName);
  });
  res.set('Content-Type', 'text/xml');
  res.send(resp.toString());

});

app.get('/test', function (req, res) {
    res.sendfile('./public/test.html');
});

app.post('/test/data', function (req, res) {
    if(req == null) {
        console.log('nothing');
    } else {
        console.log('success: '+ req);
    }
});

app.get('/background.html', function (req, res) {
    res.sendfile('./public/background.html');
});







app.get('/response', function (req, res) {
    // Create a TwiML response
    var resp = new twilio.TwimlResponse();

    // The TwiML response object will have functions on it that correspond
    // to TwiML "verbs" and "nouns". This example uses the "Say" verb.
    // Passing in a string argument sets the content of the XML tag.
    // Passing in an object literal sets attributes on the XML tag.
    resp.say({voice:'woman'}, 'Hello welcome to my twilio automated response');
 
    //Render the TwiML document using "toString"
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    console.log(resp.toString());
    res.end(resp.toString());
 
});

app.get('/forward', function (req, res) {

    var resp = new twilio.TwimlResponse();
    console.log(req);
    resp.dial(function () { this.number('312-718-8814')
        });

   /* res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());*/
    res.set('Content-Type', 'text/xml');
    res.send(resp.toString());

});
 
 //project 44 api call
/*twilioClient.calls.create({  
    to: test1NUMBER,
    from: MY_NUMBER, 
    //url: "http://demo.twilio.com/docs/voice.xml",
    url: "http://1a41eef.ngrok.com/response",  
    method: "GET",  
    fallbackMethod: "GET",  
    statusCallbackMethod: "GET",    
    record: "false" 
}, function(err, call) { 
    console.log(err);
    console.log(call.sid); 
});*/

// twilioClient.calls.create({
//     url: "http://demo.twilio.com/docs/voice.xml",
//     to: testNumber,
//     sendDigits: "1234#",
//     from: MY_NUMBER,
//     method: "GET"
// }, function(err, call) {
//     console.log(err);
//     process.stdout.write(call.sid);
// });

//message to inna
// twilioClient.sendMessage({

//     to: HOST_NUMBER, // Any number Twilio can deliver to
//     from: MY_NUMBER, // A number you bought from Twilio and can use for outbound communication
//     body: 'Hey whats up; from twilio.' // body of the SMS message

// }, function(err, responseData) { //this function is executed when a response is received from Twilio

//     console.log(err);

//     if (!err) { // "err" is an error received during the request, if any

//         // "responseData" is a JavaScript object containing data received from Twilio.
//         // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
//         // http://www.twilio.com/docs/api/rest/sending-sms#example-1

//         console.log(responseData.from); //
//         console.log(responseData.body); // 

//     }
// });

app.get('/twilio/account', function(request, response) {
    twilioClient.accounts(twCreds.TWILIO_SID).get(function(err, account) {
        if(err) {
            response.send({});
        } else {
            response.send({
                friendlyName: account.friendly_name,
                created: account.date_created,
                sid: account.sid,
                status: account.status
            });
        }
    });
});


app.post('/sms', function(request, response) {
  // Start here
  console.log(request.body);

  response.send('ok');
});
