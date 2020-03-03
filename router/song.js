const express = require("express");
const SongController = require("../controllers/song");
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");
const multipart = require("connect-multiparty");
const md_upload = multipart({uploadDir: './uploads/songs'});

api.get("/pruebaSong",SongController.pruebasSong);
api.post("/saveSong/:id",md_auth.ensureAuth,SongController.saveSong);
api.get("/getSong/:id",md_auth.ensureAuth,SongController.getSong);
// api.get("/getSongs/:id?",md_auth.ensureAuth,SongController.getSongs);
api.get('/getsongs/:idUser/:album?',md_auth.ensureAuth,SongController.getSongs);
api.put("/updateSong/:id",md_auth.ensureAuth,SongController.updateSong);
api.delete("/deleteSong/:id",md_auth.ensureAuth,SongController.deleteSong);
api.post("/uploadSong/:id",[md_auth.ensureAuth,md_upload],SongController.uploadFile);
api.get("/getFileSong/uploads/songs/:songFile",SongController.getSongFile);

api.get("/search/:palabra?",SongController.busqueda);

module.exports=api;