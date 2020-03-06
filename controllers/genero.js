const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');

const Artist = require('../models/artist');
const Genero = require('../models/genero');
const Album= require('../models/album');
const Song = require('../models/song');
const Favoritos = require('../models/favorites');


function prueba(req,res) {
    res.status(200).send({message:"hola"});
}
function saveGenero(req,res)
{
    var genero = new Genero();
    var params=req.body;
    genero.name=params.name;
    genero.description=params.description;
    genero.save().then(saveGenero=>{
        !saveGenero ? res.status(404).send({message:"No se pudo guardar genero"}) : res.status(200).send({message:"Genero Guardado"})
    }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });    
}

function updateGenero(req,res)
{
    var idGenero=req.params.id;
    var update =req.body;
    Genero.findByIdAndUpdate(idGenero,update,{new:true}).then(
        generoUpdate=>{
            !generoUpdate ? res.status(404).send({message:"No se pudo modificar el genero"}) : res.status(200).send({message:"Genero Modificado",genero:generoUpdate})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });    
}

function deleteGenero(req,res)
{
    var idGenero=req.params.id;    
    Genero.findOneAndRemove({_id: idGenero}).then(
        deleteGenero=>{
            if(!deleteGenero)
            {
                res.status(404).send({message:"No se pudo eliminar el genero"});
            }
            else{                
                Song.find({genero:deleteGenero._id}).remove((err,songDelete)=>{
                    if(err)
                    {
                        res.status(500).send({message:"Error en el servidor"});
                    }
                    else
                    {
                        !songDelete ? res.status(404).send({message:"Error al eliminar canciones de ese genero"}) : res.status(200).send({message:"Genero Eliminado",deleteGenero})                        
                    }
                })  
            }
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });   
}
function getGenero(req,res)
{
    var idGenero=req.params.id;
    Genero.findById(idGenero).then(
        genero=>{
            !genero ? res.status(404).send({message:"No se pudo mostrar el genero"}) : res.status(200).send({genero:genero})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });    
}
function getGeneros(req,res)
{   
    Genero.find({}).sort('name').then(
        generos=>{
            !generos ? res.status(404).send({message:"No hay generos"}):res.status(200).send({genero:generos})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        }); 
}
function getSongsGenero(req,res)
{
    var idGenero=req.params.id;
    Song.find({"genero":idGenero}).populate({path:'album',populate:{path:'artist'}}).then(
        songs=>{
            !songs ? res.status(404).send({message:"No Hay canciones disponibles"}) : res.status(200).send({songs:songs})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
module.exports = {
    prueba,
    saveGenero,
    updateGenero,
    deleteGenero,
    getGenero,
    getGeneros,
    getSongsGenero
}