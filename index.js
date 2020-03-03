const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/musify",(req,res)=>{
    if(req)
    {   
        throw req;
    }
    else
    {
        console.log("Base de datos conectada");
        app.listen(port,function(){
            console.log(`servidor de musify conectado:${port}`);
        });
    }
});