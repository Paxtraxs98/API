const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GeneroSchema = Schema({
    name: String,
    description: String,    
});

//guarda en la BD en un coleccion que se llama Artist
module.exports = mongoose.model("Genero", GeneroSchema);