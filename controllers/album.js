const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const Album = require("../models/album");
const Song = require("../models/song");
const jwt = require("../services/jwt");
const mongoosePagination = require('mongoose-pagination');

function pruebasAlbuma(req,res)
{
    res.status(200).send({message:"hola"});
}
function saveAlbum(req,res)
{
    const album=new Album();
    const artistId=req.params.id;
    var params=req.body;
    album.name=params.name;
    album.description=params.description;
    album.ano=params.ano;
    album.imagen='null';
    album.artist=artistId;
    album.save().then(
        saveAlbum=>{
            !saveAlbum ? res.status(404).send({message:"Error al guardar Album"}) : res.status(200).send({message:"Album Guardado",saveAlbum})            
        }).catch(
            err=>{
                res.status(500).send({message:"Error en el Servidor"})
        });  
}
function getAlbum(req,res)
{
    const albumId=req.params.id;    
    Album.findById(albumId).populate({path:"artist"}).then(
        album=>{        
            !album ? res.status(404).send({message:"Este artista no tiene Albums"}) :  res.status(200).send({message:"Album Seleccionado",album});
        }).catch(
            err=>{
                res.status(500).send({message:"Error en el servidor"});
        });
}
function getAlbums(req,res)
{
    var find;
    const artistId=req.params.id;            
    !artistId ? find=Album.find({}).sort('name').populate({path:'artist'}) : find=Album.find({artist:artistId}).sort('name').populate({path:'artist'})
    find.then(
        albums=>{
            !albums ? res.status(500).send({message:"Este Artista no tiene albums"}) : res.status(200).send({albums})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });         
  
}
function updateAlbum(req,res)
{
    const albumId=req.params.id;
    var update=req.body;
    Album.findByIdAndUpdate(albumId,update,{new:true}).then(
        albumUpdate=>{
            !albumUpdate ? res.status(404).send({message:"NO se pudo localizar el album para modificar"}) : res.status(200).send({message:"Album Modificado",Album:albumUpdate})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });    
}
function deleteAlbum(req,res)
{
    const albumId=req.params.id;
    Album.findByIdAndRemove(albumId).then(
        albumRemoved=>{
            if(!albumRemoved)
            {
                res.status(404).send({message:"Album no encontrado"})
            }
            else
            {                
                Song.find({album:albumRemoved._id}).remove((err,songDelete)=>{
                    if(err)
                    {
                        res.status(500).send({message:"Error en el servidor"});
                    }
                    else
                    {
                        if(!songDelete)
                        {
                            res.status(404).send({message:"Error al eliminar cancion"});
                        }
                        else
                        {                                        
                            res.status(200).send({message:"Album Eliminado",albumRemoved})
                        }
                    }
                })                            
            }
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });    
}
function uploadImageAlbum(req,res)
{
    const albumId = req.params.id;
    var file_name = "No imagen..";
    if(req.files){

        const file_path = req.files.imagen.path;
        const file_split = file_path.split('\.');
        var file_name = file_split[2];
        const extend = file_split[1];      

        if(extend == "png" || extend == "jpg" || extend == "gif" || extend == "jpeg"){
            Album.findByIdAndUpdate(albumId,{imagen: file_path},{new:true}).then(
                albumUpdated=>{
                    !albumUpdated ? res.status(404).send({message:"No se ha podido actualizar el usuario"}) : res.status(200).send({album: albumUpdated})
                }).catch(
                err=>{
                    res.status(404).send({message:"No se ha podido actualizar el usuario"});
                });            
        }else{
            res.status(200).send({message: "Extencion de imagen no valida"})
        }        
    }else{
        res.status(200).send({message:"no has cargado ninguna imagen"});
    }
}
function getImageFile(req,res) {
    var imageFile = req.params.imagenFile;
    var path_file = './uploads/albums/'+imageFile;    
    fs.exists(path_file, function (exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la imagen"});
        }
    });
}

module.exports = {
    pruebasAlbuma,
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImageAlbum,
    getImageFile
};