const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');

const Favoritos = require('../models/favorites');

function prueba(req,res) {
    res.status(200).send({message:"hola"});
}
function saveFavorites(req,res)
{
    const userId = req.params.id;
    const songId=req.params.cancionId; 
    Favoritos.findOneAndUpdate({"user":userId},{$addToSet:{songs:songId}},{new:true}).then(
        Data=>{
            !Data ? res.status(404).send({message:"No se pudo agregar a Favoritos"}) : res.status(200).send({message:" Cancion guardada en Favoritos",Data})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function removeFavorites(req,res)
{
    const userId = req.params.id;
    const cancionId=req.params.cancionId;
    Favoritos.findOneAndUpdate({"user":userId},{$pull:{songs:cancionId}},{new:true}).then(
        Data=>{
            !Data ? res.status(404).send({message:"No se pudo Eliminar de Favoritos"}) : res.status(200).send({message:" se Removio de favoritos",Data})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });    
}
function getFavoritos(req,res)
{
    const userId=req.params.id;
    Favoritos.find({"user":userId},{songs:1}).populate({path: 'songs',options: { sort: { 'name': 1 } },populate:{path:'album',populate:{path:'artist'}}}).then(
        favoritos=>{
            !favoritos ? res.status(404).send({message:"No tienes favoritos"}) : res.status(200).send({favoritos})
            //si hay un error colocar favoritos==''
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el Servidor"})
        });
}

module.exports = {
    prueba,
    saveFavorites,
    getFavoritos,    
    removeFavorites
}