const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const Song = require("../models/song");
const Artist=require("../models/artist");
const Album=require("../models/album");
const Favoritos = require("../models/favorites");
const jwt = require("../services/jwt");
const mongoosePagination = require('mongoose-pagination');

function pruebasSong(req,res)
{
    res.status(200).send({message:"hola song"});
}
function saveSong(req,res)
{
    const song=new Song();
    const albumId=req.params.id;
    var params=req.body;
    song.number=params.number;
    song.name=params.name;
    song.file='null';
    song.duration=params.duration;
    song.album=albumId;
    song.genero=params.genero;
    song.save().then(
        saveSong=>{
            !saveSong ? res.status(200).send({message:"No se pudo guardar la cancion"}) : res.status(200).send({message:"Cancion Guardada",saveSong})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function getSong(req,res)
{
    const songId=req.params.id;
    Song.findById(songId).populate({path:"album",populate:{path:"artist",model:"Artist"}}).then(
        song=>{
            !song ? res.status(404).send({message:"No se encuentra esa cancion"}) : res.status(200).send({message:"Cancion:",song})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el Servidor"})
        });
}
function getSongs(req,res)
{
    const albumId = req.params.album;
    var userId = req.params.idUser;
    var statusSongs=[];
    var find;
    !albumId ? find = Song.find({}).sort("number") : find = Song.find({album: albumId}).sort("number")
    find.populate({path: "album",populate: {path: 'artist',model: 'Artist'}}).then(
        songs=>{
            if(!songs)
                {
                    res.status(404).send({message:"No hay canciones"});
                }
                else
                {                                                
                    for(let i in songs)
                    {                             
                        statusSongs.push(Favoritos.find({user:userId,songs:songs[i]._id}).exec());   
                    }                                
                            
                    Promise.all(statusSongs).then( all_promises =>{
                        var resultado = songs.flatMap((songs, indice) => {
                             return {song: songs,
                                     status: all_promises[indice]
                             }
                        });                                    
                        res.status(200).send({resultado});                            
                     })               
                }
        }).catch(
        err=>{
            res.status(500).send({message:"Error en la peticion"})
        });  
}
function updateSong(req,res)
{
    const songId=req.params.id;
    const update=req.body;    
    Song.findByIdAndUpdate(songId,update).then(
        updateSong=>{
            !updateSong ? res.status(404).send({message:"No se pudo modificar la cancion"}) : res.status(200).send({message:"Modificacion exitosa",updateSong})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        })
}
function deleteSong(req,res)
{
    const songId=req.params.id;
    Song.findByIdAndRemove(songId).then(
        deleteSong=>{
            !deleteSong ? res.status(404).send({message:"No se pudo eliminar la cancion"}) : res.status(200).send({message:"Cancion eliminada",deleteSong})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function uploadFile(req,res) {    
    const songId = req.params.id;
    if(req.files)
    {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\.');
        var file_name = file_split[2];
        const extend = file_split[1];        
        if(extend == "mp3" || extend == "ogg" || extend == "mp4"){
            Song.findByIdAndUpdate(songId,{file: file_path},{new:true}).then(
                songUpdated=>{
                    console.log(songUpdated);
                    !songUpdated ? res.status(404).send({message:"No se ha podido actualizar la cancion"}) : res.status(200).send({song: songUpdated})
                }).catch(
                err=>{
                    res.status(500).send({message:"Error en el servidor"})
                })         
        }else{
            res.status(500).send({message: "Extencion del archivo no valida"})
        }
    }
    else
    {
        res.status(404).send({message:"no has cargado ninguna cancion"});
    }
}
function getSongFile(req,res) 
{
    const songFile = req.params.songFile;
    const path_file = './uploads/songs/'+songFile;
    fs.exists(path_file, function (exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la cancion"});
        }
    });
}
function busqueda (req,res)
{    
    var palabra=req.params.palabra;  
    console.log(palabra);
    if(!palabra)
    {
        palabra='a';
    }      
    Artist.find({ "name": { $regex:new RegExp('.*' + palabra , 'i') } },
    (err,data)=>{
          if(err)
          {
            res.status(500).send({message:"Error en el Servidor artista"})
          }
          else
          {
             
            Album.find({ "name": { $regex:new RegExp('.*' + palabra , 'i') } },
            (err,data2)=>{
                if(err)
                {
                    res.status(500).send({message:"Error en el Servidor album"})
                }
                else
                {                   
                    Song.find({ "name": { $regex:new RegExp('.*' + palabra , 'i') } },
                        (err,data3)=>{
                            if(err)
                            {
                                res.status(500).send({message:"Error en el Servidor song"})
                            }
                            else
                            {
                                res.status(200).send({Artistas:data,Albums:data2,Songs:data3});                               
                            }
                    });    
                }
            });
          }
   });
}
module.exports = {
    pruebasSong,
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile,
    busqueda
};