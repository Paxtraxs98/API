const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayListSchema = Schema({    
    user: {type: Schema.ObjectId, ref:"User"},
    namePlayList:String,
    playlist:[{type: Schema.ObjectId, ref:"Song"}]
});

//guarda en la BD en un coleccion que se llama Artist
module.exports = mongoose.model("PlayLists", PlayListSchema);