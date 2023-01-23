const express = require('express');
const router = express.Router();
const functions = require('../../BOT/functions');
const discord = require('../../BOT/discordmain');

router.get('', async (req, res) => {
  try {
    const guild = await discord.client.guilds.fetch(req.query.guildID);
    // Get Members
    const member = await guild.members.fetch(req.query.userID);
    const perm = member.permissions;

    res.status(200).json(perm.toArray());
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})


module.exports = router;