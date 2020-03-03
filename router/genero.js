const express = require("express");
const GeneroController = require("../controllers/genero");
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");

api.post("/saveGenero",GeneroController.saveGenero);
api.get("/getGenero/:id",GeneroController.getGenero);
api.get("/getGeneros/",GeneroController.getGeneros);
api.get("/getSongsGenero/:id",GeneroController.getSongsGenero);
api.put("/updateGenero/:id",GeneroController.updateGenero);
api.delete("/deleteGenero/:id",GeneroController.deleteGenero);

module.exports=api;