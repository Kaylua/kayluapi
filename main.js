// Setup Express.js
const express = require('express');
const app = express();

// Configure DotENV
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Middleware to parse body to JSON for all JSON requests
app.use(express.json())

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Setup Discord.js
require('./BOT/discordmain')

// CONNECTION DB
const { connect, ConnectionStates, connection, connections } = require("mongoose");
const dbToken = process.env.databaseToken;

const connectDB = async() => {
  try{
    await connect(dbToken);
    console.log("MongoDB connected !");
  } catch(err){
    console.log("Failed to connect to MongoDB", err);
  }
}
connectDB();

// API Routes et Ports
const port = process.env.PORT_API || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`)
})

app.use('/api/servers', require('./API/routes/servers'))
app.use('/api/messaging', require('./API/routes/messaging'))
app.use('/api/kick', require('./API/routes/kick'))
app.use('/api/ban', require('./API/routes/ban'))
app.use('/api/createsalontextuel', require('./API/routes/createsalontextuel'))
app.use('/api/createsalonvocal', require('./API/routes/createsalonvocal'))
app.use('/api/deletesalon', require('./API/routes/deletesalon'))
app.use('/api/bracelet', require('./API/routes/bracelet'))
app.use('/api/nobracelet', require('./API/routes/nobracelet'))
app.use('/api/unban', require('./API/routes/unban'))
app.use('/api/joinchannel', require('./API/routes/joinchannel'))
app.use('/api/leavechannel', require('./API/routes/leavechannel'))
app.use('/api/playsound', require('./API/routes/playsound'))
app.use('/api/playsoundYTB', require('./API/routes/playsoundYTB'))
app.use('/api/databaseinfo', require('./API/routes/routes_DB/databaseinfo'))
app.use('/api/stopsound', require('./API/routes/stopsound'))
app.use('/api/getmemberperm', require('./API/routes/getmemberperm'))
app.use('/api/getguildroles', require('./API/routes/getguildroles'))

// DB Routes
app.use('/api/addyoutubelink', require('./API/routes/routes_DB/addyoutubelink'))
app.use('/api/databaseinfo', require('./API/routes/routes_DB/databaseinfo'))
app.use('/api/deleteyoutubelink', require('./API/routes/routes_DB/deleteyoutubelink'))
app.use('/api/addsoundpath', require('./API/routes/routes_DB/addsoundpath'))
app.use('/api/deletesoundpath', require('./API/routes/routes_DB/deletesoundpath'))
