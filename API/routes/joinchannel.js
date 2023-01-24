const express = require('express')
const router = express.Router()
const functions = require('../../BOT/functions')
const discord = require('../../BOT/discordmain')

router.post('', async (req, res) => {
  try {
    await functions.joinchannel(req.body.channelID, req.body.guildID)
    res.status(200).json({ message: 'Channel joined' })
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router