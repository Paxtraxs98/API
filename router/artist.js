const express = require("express");
const ArtistController = require("../controllers/artist");
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");
 const multipart = require("connect-multiparty");
const md_upload = multipart({uploadDir: './uploads/artists'});

api.get("/pruebaArtist",ArtistController.pruebasArtist);
api.post("/saveArtist",md_auth.ensureAuth,ArtistController.saveArtist);
api.get("/getArtist/:id",md_auth.ensureAuth,ArtistController.getArtist);
api.get("/getArtists/:page?",md_auth.ensureAuth,ArtistController.getArtists);
api.put("/updateArtist/:id",md_auth.ensureAuth,ArtistController.updateArtist);
api.delete("/deleteArtist/:id",md_auth.ensureAuth,ArtistController.deleteArtist);
api.post("/uploadImageArtist/:id",[md_auth.ensureAuth,md_upload],ArtistController.uploadImage);
api.get("/imageArtist/uploads/artists/:imagenFile",ArtistController.getImagenArtist);

module.exports=api;