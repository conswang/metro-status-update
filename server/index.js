const express = require('express')
const https = require('https')
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express()
const port = 3000

const ACCESS_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAAykEQEAAAAAZTmUIqu2ExG05RwZkPER23J622Y%3DZU4oVKBKY7MYuCb1Og1b71lrEaA7HOFsi3iGhPN5CdyvSEkx1O'

app.use(bodyParser.urlencoded({ extended: false }));

// Database connection
const mongoose = require('mongoose')

const uri = "mongodb+srv://hello:hello@cluster0-fe3he.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}
  );
  const connection = mongoose.connection;
  connection.once('open', () => {
      console.log('MongoDB database connection established successfully');
  });

// Request parameters

var options = {
  hostname: 'api.twitter.com',
  path: '/1.1/statuses/user_timeline.json?screen_name=TTCnotices',
  headers: {
      Authorization: 'Bearer ' + ACCESS_TOKEN
  }
}

const addRoute = require('./database').addRoute
addRoute({number: '510', status: 'delayed'})

// Pull updates from TTC every second
const cron = require('node-cron')

const cronJob = cron.schedule(`0 * * * * *`, () =>  {
  https.get(options, function (result) {
      var buffer = '';
      result.setEncoding('utf8');
      result.on('data', function (data) {
          buffer += data;
      });
      result.on('end', function () {
          var tweets = JSON.parse(buffer);
          console.log(tweets); // the tweets!
      });
  })
})



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

const addUser = require('./database').addUser
const getRoutes = require('./database').getRoutes

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  if (!req.body.Body.indexOf('update')) {
    const pnumber = req.body.From
    const routes = getRoutes(pnumber)
    twiml.message('Info: ' + routes);

  } else if (!req.body.Body.indexOf('setup')) {
    const config = req.body.Body.replace("setup ", "")
    const pnumber = req.body.From

    addUser(pnumber, config)

    twiml.message('User settings saved for ' + pnumber);
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