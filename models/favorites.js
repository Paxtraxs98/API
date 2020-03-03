const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritesSchema = Schema({    
    user: {type: Schema.ObjectId, ref:"User"},
    songs: [        
            {type: Schema.ObjectId, ref:"Song"},               
    ]
});

//guarda en la BD en un coleccion que se llama Artist
module.exports = mongoose.model("Favorites", FavoritesSchema);