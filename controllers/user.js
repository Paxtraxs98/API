
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const Favoritos = require("../models/favorites");
const jwt = require("../services/jwt");
const sgMail = require('@sendgrid/mail');
// const SENDGRID_API_KEY='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'
function pruebas(req,res) {
    res.status(200).send({
        message: "Probando controlador ussuarios"
    });
}
function saveUser(req,res)
{
    const user = User();
    const params =req.body;        
    if(params.password != '' && params.email != '' && params.name != '')
    {        
        User.findOne({email: params.email.toLowerCase()}, (err, usersearch)=>{
            if(err)
            {
                res.status(500).send({message:"Error en el servidor"});
            }
            else
            {
                if(!usersearch)
                {
                    user.name=params.name;
                    user.email=params.email;
                    user.role="ROLE_USER";
                    user.imagen="null";
                    user.status="0";
                    bcrypt.hash(params.password,null,null,function(err,hash)
                    {
                        user.password=hash;
                        user.save((err,userSave)=>{
                            if(err)
                            {
                                
                                res.status(500).send({message:"Error en el servidor"});
                            }
                            else
                            {
                                if(!userSave)
                                {
                                    res.status(404).send({message:"Error al guardar el usuario"});
                                }
                                else
                                {       
                                    console.log(userSave);                             
                                    // var SENDGRID_API_KEY='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'
                                    sgMail.setApiKey('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');
                                    const msg = {
                                    to: userSave.email,
                                    from: 'pakogonzalezgil@gmail.com',
                                    subject: 'Confirmacion de cuenta',
                                    text: 'prueba 1.1 node y sendgrid',
                                    html:'<div style="background-color: #fff; width: 100%;"><div style="text-align: center;"><h1 style="color:#4e85ae">Bienvenido '+userSave.name+' a Musify</h1></div><div style="width:40%; margin: auto;text-align: center;"><a href="http://localhost:4200/ConfirmAccount/'+userSave._id+'" style="color:white;font-size: 20px;text-decoration: none;"><div style="padding:20px;background:#4e85ae;border-radius: 10px">Confirmar Cuenta</div></a></div></div>'
                                    // html: '<a href="http://localhost:4200/ConfirmAccount/'+userSave._id+'">Confirmar Cuenta</a>',
                                    };
                                    console.log("----------")
                                    console.log(msg)
                                    console.log("----------")
                                    sgMail.send(msg);
                                    
                                    res.status(200).send({message:"Porfavor verifica tu cuenta desde tu email",userSave,token: jwt.createTokenValidation(userSave)});                                     
                                }
                            }
                        });
                    });
                }
                else
                {
                    res.status(500).send({message:"Error el usuario ya existe"});
                }
            }
        });
        
    }
    else
    {
        res.status(404).send({message:"faltan datos"});
    }
}
function validation(req,res)
{    
    const userId=req.user.sub;    
    var update = {
        $set:{status: true}
    }
    User.findByIdAndUpdate(req.user.sub, update,{new:true}).then(
        validationCompleted=>{
            !validationCompleted ? res.status(404).send({message:"Error no se pudo completar la validacion"}) : res.status(200).send({validationCompleted})        
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        }
    );  
}
function login(req,res)
{    
    const params =req.body;    
    const email=params.email;
    const password = params.password;
        
    User.findOne({email:email.toLowerCase()},(err, user)=>{
        if(err)
        {
            res.status(500).send({message:"Error en el Servidor"});
        }
        else
        {
            if(!user)
            {
                res.status(404).send({message:"No existe el usuario"});
            }
            else
            {
               if(user.status==false)
               {
                res.status(404).send({message:"Cuenta no verificada"});
               }
               else{
                bcrypt.compare(password,user.password,function(err,check){
                    if(check)
                    {                        
                        if(params.gethash)
                        {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });                            
                        }
                        else
                        {
                            res.status(200).send({user});
                        }
                    }
                    else
                    {
                        res.status(404).send({message: "Las contraseñas no son iguales"});
                    }
                });
               }
            }
        }
    });
}
function updateUser(req,res)
{      
    const userId= req.params.id;
    
    const datosUsuarioUpdate =req.body;    
    User.findByIdAndUpdate(userId,datosUsuarioUpdate,{new:true}).then(
        userUpdate=>{
            !userUpdate ? res.status(404).send({message:"Error no se pudo modificar el usuario"}) : res.status(200).send({userUpdate})
        }).catch(
        err=>{
            res.status(500).send({message:"Error en el servidor"})
        })
}
function updatePassword(req,res)
{    
    const userId= req.params.id;    
    const datosUser = req.body;
    const passwordEdit =datosUser.password;            
    User.findById(userId, (err,usersearch) => {
        if(err)
        {
            res.status(500).send({message:"Error en el servidor"});
        }
        else
        {
            if(!usersearch)
            {
                res.status(404).send({message:"Error no se pudo modificar el usuario"});
            }
            else{           
                bcrypt.compare(passwordEdit,usersearch.password,function(err,check){
                if(check)
                     {                     
                        res.status(500).send({message: "Las contraseñas son iguales "});                        
                     }
                     else
                     {                        
                        bcrypt.hash(passwordEdit, null, null, function(err, hash) 
                        {
                            usersearch.password = hash;                               
                            usersearch.save((err,userStored)=>
                            {
                                    if(err){
                                        res.status(500).send({message:"Error en el servidor"});
                                    }else{
                                        if (!userStored) {
                                            res.status(404).send({message:"No se ha modificado el password"});
                                        }else{
                                            res.status(200).send({user: usersearch});
                                        }
                                    }
                            });
                            
                        });
                    }
                });
            }
        }
    });
        
}
function deleteUser(req,res)
{
 const userId=req.params.id;
 User.findByIdAndRemove(userId,(err,userDelete)=>{
    if(err)
    {
        res.status(500).send({message:"Error en el servidor"});
    }
    else
    {
        if(!userDelete)
        {
            res.status(404).send({message:"No se pudo eliminar el usuario"});
        }
        else
        {
            res.status(200).send({userDelete});
        }
    }
 });
}
function uploadImage(req,res)
{
    const userId = req.params.id;    
    if(req.files)
    {        
        const file_path = req.files.image.path;
        const file_split = file_path.split('\.');
        const extencion=file_split[1];        
        if(extencion == "png" || extencion == "jpg" || extencion == "gif" || extencion == "jpge")
        {
            User.findOneAndUpdate({"_id":userId},{imagen:file_path}).then(
                userUpdate=>{
                    !userUpdate ? res.status(400).send({message:"No se puede modificar la imagen"}) : res.status(200).send({message:"Imagen de perfil cambiada",imagen:file_path})
                }).catch(
                err=>{
                    res.status(500).send({message:"Error en el servidor"})
                });            
        }
        else{
            res.status(200).send({message:"Extencion de imagen no valida"});
        }
    }
    else{
        res.status(200).send({message:"No se cargo ninguna imagen"});
    }
}
function getImagenUser(req,res)
{
    const imagenFile = req.params.imagenFile;    
    const path_file ='./uploads/users/' + imagenFile;    
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
    pruebas,
    saveUser,
    validation,
    login,
    updateUser,
    updatePassword,    
    deleteUser,
    uploadImage,
    getImagenUser
};