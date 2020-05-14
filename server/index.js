const express = require('express')
const https = require('https')
const app = express()
const port = 3000

const ACCESS_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAAykEQEAAAAAZTmUIqu2ExG05RwZkPER23J622Y%3DZU4oVKBKY7MYuCb1Og1b71lrEaA7HOFsi3iGhPN5CdyvSEkx1O'

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

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