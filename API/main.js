const express = require('express');
const app = express();

// Configure DotENV
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

// Middleware to parse body to JSON for all JSON requests
app.use(express.json())

// endpoint for '/'
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// You can create as many endpoints as you want by using the app.get() method and specifying a different path for each endpoint. The req.params object is used to access any parameters passed in the URL.

// You can also use app.post() for post request, app.put() for update and app.delete() for delete request.

app.use('/chat_gpt', require('./routes/chat_gpt'))
app.use('/stream_ping', require('./routes/stream_ping'))
