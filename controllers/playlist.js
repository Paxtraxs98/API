const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');

const PlayList = require('../models/playlist');

function prueba(req,res) {
    res.status(200).send({message:"hola"});
}
function createPlay(req,res)
{
    var playList =new PlayList();
    const userId = req.params.id;
    const params=req.body;    
    playList.user=userId;
    playList.namePlayList=params.namePlayList;   
    playList.save().then(
        playlistSave=>{
            !playlistSave ? res.status(404).send({message:"No se pudo crear la PlayList"}) : res.status(200).send({message:" PlayList Creada",playlistSave})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el Servidor"})
        }); 
}
function editPlayLists(req,res)
{
    var idplayList=req.params.id;
    var update =req.body;  
    PlayList.findByIdAndUpdate(idplayList,update).then(
        playListUpdate=>{
            !playListUpdate ? res.status(404).send({message:"No se pudo modificar el genero"}) : res.status(200).send({message:"PlayList Modificada",playlist:playListUpdate})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function saveSongPlayList(req,res)
{
    const userId = req.params.id;
    const lista=req.params.idPlayList;
    const song=req.params.idSong;    
    PlayList.findOneAndUpdate({"_id":lista,"user":userId},{$addToSet:{playlist:song}},{new:true}).then(
        saveplay=>{
            !saveplay ? res.status(404).send({message:"No se pudo Guardar en la PlayList"}) : res.status(200).send({message:" Cancion agregada a la PlayList",saveplay})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidors"})
        });
}
function getPlayList(req,res)
{
    const userId=req.params.id;
    const playlistId=req.params.idPlayList;
    PlayList.find({"_id":playlistId,"user":userId}).populate({path: 'playlist',model:'Song'}).then(
        detallPlay=>{
            !detallPlay ? res.status(200).send({message:"No tienes PlayList"}) : res.status(200).send({message:"PlayList",detallPlay});
            //si hay un error colocar detalPlay=''
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function getPlayLists(req,res)
{
    const userId=req.params.id;    
    PlayList.find({"user":userId}).populate({path: 'playlist',model:'Song'}).then(
        PlayLists=>{
            !PlayLists ? res.status(200).send({message:"No hay PlayLists",PlayLists}) : res.status(200).send({message:"PlayLists",PlayLists})
            //si marca error colocar PlayLists='' 
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function removeSongPlayList(req,res)
{
    const userId = req.params.id;
    const playlistId=req.params.idPlayList;
    const cancionId =req.params.idSong;
    PlayList.findOneAndUpdate({"_id":playlistId,"user":userId},{$pull:{playlist:cancionId}},{new:true}).then(
        Data=>{
            !Data ? res.status(404).send({message:"Error al remover la cancion de la lista"}) : res.status(200).send({message:" Cancion removida de la PlayList",Data})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}
function deletePlayList(req,res)
{
    const userId=req.params.id;
    const playlistId = req.params.idPlayList;
    PlayList.findByIdAndRemove({"_id":playlistId}).then(
        playListDelete=>{
            !playListDelete ? res.status(404).send({message:"PlayList no Eliminada"}) : res.status(200).send({message:"PlayList Eliminada"})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        });
}

module.exports = {
    prueba,
    createPlay,
    saveSongPlayList,
    getPlayList,
    getPlayLists,
    editPlayLists,
    removeSongPlayList,
    deletePlayList
}