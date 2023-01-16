const express = require('express')
const router = express.Router()
const dotenv = require('dotenv');

router.post('', async (req, res) => {
    try {




      request({
        url: `https://api.twitch.tv/helix/streams?user_id=${streamerId}`,
        headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`
        }
      }, (error, response, body) => {
        if(error) {
          console.log(error);
        }
        const data = JSON.parse(body);
        if(data.data.length > 0) {
          // streamer is currently live, send notification
          //sendNotification();
          console.log("Est en stream")
        } else {
          // streamer is offline
          res.send('Streamer is offline.');
        }
      });




    }
    catch (err) {
        res.status(500).json(err.message)
        console.log(err)
    }
})


module.exports = router