const { Schema, model } = require('mongoose');
const logSchema = new Schema({
    action: String,
    username: String,
    guildID: Number,
    discriminator: String,
    time: Date,
    options: Map,
})

module.exports = model("log", logSchema, "logs");