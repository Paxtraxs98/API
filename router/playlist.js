const express = require('express');
const PlaylistController = require('../controllers/playlist');
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");



api.get('/playprueba', PlaylistController.prueba);
api.post('/createPlaylist/:id',md_auth.ensureAuth,PlaylistController.createPlay);
api.post('/addSongPlaylist/:id/:idPlayList/:idSong',md_auth.ensureAuth,PlaylistController.saveSongPlayList);
api.get('/getPlayList/:id/:idPlayList',md_auth.ensureAuth,PlaylistController.getPlayList);
api.get('/getPlayLists/:id',md_auth.ensureAuth,PlaylistController.getPlayLists);
api.put('/editPlayLists/:id',md_auth.ensureAuth,PlaylistController.editPlayLists);
api.delete('/deleteSongPlayList/:id/:idPlayList/:idSong',md_auth.ensureAuth,PlaylistController.removeSongPlayList);
api.delete('/deletePlayList/:idPlayList',md_auth.ensureAuth,PlaylistController.deletePlayList);

module.exports = api;