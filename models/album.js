const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = Schema({
    name:String,
    description:String,    
    ano:String,        
    imagen:String,
    artist: {type: Schema.ObjectId, ref:"Artist"}
});

module.exports = mongoose.model("Album",AlbumSchema);