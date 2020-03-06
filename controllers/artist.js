const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const jwt = require("../services/jwt");
const mongoosePagination = require('mongoose-pagination');

function pruebasArtist(req,res) {
    res.status(200).send({
        message: "Probando controlador artist"
    });
}
function saveArtist(req,res)
{
    const artist = Artist();
    var params =req.body;
    artist.name=params.name;
    artist.genero=params.genero;
    artist.imagen='null';
    artist.save().then(
        ArtistSave=>{
            !ArtistSave ? res.status(404).send({message:"Error al registrar Artisto"}) : res.status(200).send({message:"Artista Guardado",ArtistSave});
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"});
        });
}
function getArtist(req,res)
{    
    const artistId=req.params.id;
    Artist.findById(artistId).then(
        artist=>{
            !artist ? res.status(404).send({message:"Error al Buscar Artista"}) : res.status(200).send({message:"Artista",artist})
        }).catch(
        err=>{
            res.status(500).send({message:"Error no existe el usuario"})
        });   
}
function getArtists(req,res)
{
    var page;
    var itemsforpage=4;
    req.params.page ? page=req.params.page : page=1  
    Artist.find().sort('name').paginate(page,itemsforpage,function(err,artists,total){
        if(err)
        {
            res.status(500).send({message:"Error en el Servidor"});
        }
        else{
            !artists ? res.status(404).send({message:"Error al llamar artistas"}) : res.status(200).send({total:total,artists:artists})
        }
    });
}
function updateArtist(req,res)
{    
    const artistId=req.params.id;
    const artistUpdate=req.body;    
    Artist.findByIdAndUpdate(artistId,artistUpdate,{new:true}).then(
        artistUpdate=>{
            !artistUpdate ? res.status(404).send({message:"Error no hay artistas"}) : res.status(200).send({message:"Se modifico el artista"})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });          
}
function deleteArtist(req,res)
{
    const artistId=req.params.id;    
    Artist.findByIdAndRemove(artistId,(err,deleteArtist)=>{
        if(err)
        {
            res.status(500).send({message:"Error en el servidor"});
        }
        else
        {
            if(!deleteArtist)
            {
                res.status(404).send({message:"Error al eliminar artista"});
            }
            else
            {                         
                Album.find({artist:deleteArtist._id}).exec((err,albums)=>{
                    if(err)
                    {
                        res.status(500).send({message:"Error en el servidor"});
                    }
                    else
                    {                         
                        if(!albums)
                        {
                            res.status(404).send({message:"Error al eliminar album"});
                        }
                        else
                        {                                         
                           for (const i in albums) 
                           {                            
                                Song.find({album:albums[i]._id}).remove((err,songDelete)=>{
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
                                            Album.findByIdAndRemove(albums[i]._id,(err,albumDelete)=>{
                                                if(err)
                                                {
                                                    res.status(500).send({message:"Error en el servidor"});
                                                }                                                
                                            })
                                        }
                                    }
                                })   
                            }                                               
                            res.status(200).send({message:"Artista Eliminado",deleteArtist});         
                        }
                    }
                })
            }
        }
    })

}
function uploadImage(req,res)
{
    const artistId = req.params.id;    
    if(req.files)
    {              
        const file_path = req.files.imagen.path;
        const file_split = file_path.split('\.');
        const extencion=file_split[1];                
        if(extencion == "png" || extencion == "jpg" || extencion == "gif" || extencion == "jpge")
        {            
            Artist.findByIdAndUpdate(artistId,{imagen:file_path},{new:true}).then(
                artistUpdate=>{
                    !artistUpdate ? res.status(400).send({message:"No se puede modificar la imagen"}) : res.status(200).send({message:"Imagen de Artista cambiada",imagen:file_path})
                }).catch(
                err=>{
                    res.status(500).send({message:"Error en el servidor"});
                });            
        }
        else{
            res.status(500).send({message:"Extencion de imagen no valida"});
        }
    }
    else{
        res.status(200).send({message:"No se cargo ninguna imagen"});
    }
}
function getImagenArtist(req,res)
{
    const imagenFile = req.params.imagenFile;    
    const path_file ='./uploads/artists/' + imagenFile;    
    fs.exists(path_file,function(exists){
        if(exists)
        {
            res.sendFile(path.resolve(path_file));
            
        }
        else
        {
            res.status(200).send({message:"No existe la imagen"});
            
        }
    });
}

module.exports = {
    pruebasArtist,
    saveArtist,
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImagenArtist
};