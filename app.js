const express = require("express");
const bodyParser = require("body-parser");
const app =express();

//cargar rutas
const userRouter = require("./router/user");
const userArtists = require("./router/artist");
const userAlbum = require("./router/album");
const userSong = require("./router/song");
const favRouter = require('./router/favorites');
const playlistRouter = require('./router/playlist');
const GeneroRouter = require('./router/genero');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabezeras
app.use((res,req,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//carga de rutas base
app.use("/api", userRouter);
app.use("/api", userArtists);
app.use("/api", userAlbum);
app.use("/api", userSong);
app.use("/api", favRouter);
app.use("/api", playlistRouter);
app.use("/api", GeneroRouter);

module.exports = app;