const express = require("express");
const FavController = require("../controllers/favoritos");
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");

api.post("/saveFavo/:id/:cancionId",FavController.saveFavorites);
api.get("/getFavoritos/:id",md_auth.ensureAuth,FavController.getFavoritos);
api.delete("/deleteFav/:id/:cancionId",md_auth.ensureAuth,FavController.removeFavorites);

module.exports=api;