const http = require('http');
const https = require('https')
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const getStationInfo = (stationName) => {
  return https.get('https://myttc.ca/'+stationName+'_station.json', function (result) {
      var buffer = '';
      result.setEncoding('utf8');
      result.on('data', function (data) {
          buffer += data;
      });
      result.on('end', function () {
          var data = JSON.parse(buffer);
          console.log(data);
      });
  })
}

app.post('/sms', (req, res) => {
  console.log("gogogo")
  const twiml = new MessagingResponse();

  if (!req.body.Body.indexOf('update')) {
    twiml.message('This is where we would provide an update on the user\'s settings');
  } else if (!req.body.Body.indexOf('setup')) {
    twiml.message('This is where we would provide confirmation that a user\'s settings have been saved');
  } else if (!req.body.Body.indexOf('station')) {
    const arr = req.body.Body.split(" ")
    console.log(arr)
    info = getStationInfo(arr[1])
    console.log(info)
    twiml.message("success");
  } else {
    twiml.message(
      'User message was not an update or setup request, so no action will be taken'
    );
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});