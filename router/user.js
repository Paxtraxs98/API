const express = require("express");
const UserController = require("../controllers/user");
const api = express.Router();
const md_auth = require("../middlewares/autoentificacion");
const multipart = require("connect-multiparty");
const md_upload = multipart({uploadDir: './uploads/users'});

api.get("/pruebaControlador",UserController.pruebas);
api.post("/saveUser",UserController.saveUser);
api.post("/preRegister",md_auth.ensureAuthValidation,UserController.validation);
api.post("/login",UserController.login);
api.put("/updateUser/:id",md_auth.ensureAuth,UserController.updateUser);
api.put("/updatePassword/:id",md_auth.ensureAuth,
UserController.updatePassword);
api.delete("/deleteUser/:id",UserController.deleteUser);
api.post("/uploadImageUser/:id",[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get("/imageUser/uploads/users/:imagenFile",UserController.getImagenUser);

module.exports=api;