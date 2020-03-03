const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = Schema({
    name:String,
    genero:String,    
    imagen:String
});

module.exports = mongoose.model("Artist",ArtistSchema);