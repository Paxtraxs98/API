const express = require("express");
const AlbumController = require("../controllers/album");
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");
 const multipart = require("connect-multiparty");
const md_upload = multipart({uploadDir: './uploads/albums'});

api.get("/pruebaAlbum",AlbumController.pruebasAlbuma);
api.post("/saveAlbum/:id",md_auth.ensureAuth,AlbumController.saveAlbum);
api.get("/getAlbum/:id",md_auth.ensureAuth,AlbumController.getAlbum);
api.get("/getAlbums/:id?",md_auth.ensureAuth,AlbumController.getAlbums);
api.put("/updateAlbum/:id",md_auth.ensureAuth,AlbumController.updateAlbum);
api.delete("/deleteAlbum/:id",md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post("/uploadImageAlbum/:id",[md_auth.ensureAuth,md_upload],AlbumController.uploadImageAlbum);
api.get("/imageAlbum/uploads/albums/:imagenFile",AlbumController.getImageFile);

module.exports=api;