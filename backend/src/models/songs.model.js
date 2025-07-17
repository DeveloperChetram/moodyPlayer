const mongoose = require('mongoose');

const songSchema= new mongoose.Schema({
    title:String,
    artist:String,
    audio:String,
})

const songModel = mongoose.model("moodySongs", songSchema);

module.exports = songModel;