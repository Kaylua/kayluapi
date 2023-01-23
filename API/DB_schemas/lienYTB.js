const { Schema, model } = require('mongoose');
const lienYTBSchema = new Schema({
    name: String,
    lienYTB: String,
    tags: String,
    userid: String,
    guildID: String,
    duration: String,
    level: Number,
})

module.exports = model("lienYTB", lienYTBSchema, "liensYTB");