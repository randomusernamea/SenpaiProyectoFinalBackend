var fs = require('fs');    
const {directorio} = require('../Utilities/directorio')   
       
       
       
exports.esTipo = (tipo) => {
    //Esta funcion regresa true si el tipo es un tipo valido, sino regresa false
    return (tipo === "Grass" || tipo === "Poison" || tipo === "Electric" || tipo === "Normal" || tipo ==="Ghost" || tipo ==="Dragon" || tipo === "Fire" || tipo ==="Water" || tipo ==="Steel" || tipo ==="Fighting" || tipo ==="Rock" || tipo ==="Ground" || tipo === "Flying" || tipo ==="Psychic" || tipo === "Ice" || tipo ==="Dark" || tipo ==="Bug" || tipo ==="Fairy")
};

exports.tipoANumero = (tipo) => {
    //Convierte el tipo a un string a numero usable por la base de datos
    switch (tipo) {
        case ("Normal"):
            return 1;
        case ("Rock"):
            return 2;
        case ("Ghost"):
            return 3;
        case ("Steel"):
            return 4;
        case ("Water"):
            return 5;
        case ("Fighting"):
            return 6;
        case ("Flying"):
            return 7;
        case ("Poison"):
            return 8;
        case ("Fairy"):
            return 9;
        case ("Dragon"):
            return 10;
        case ("Dark"):
            return 11;
        case ("Electric"):
            return 12;
        case ("Grass"):
            return 13;
        case ("Fire"):
            return 14;
        case ("Ice"):
            return 15;
        case ("Psychic"):
            return 16;
        case ("Bug"):
            return 17;
        case ("Ground"):
            return 18;
        
    }
}


exports.moverImagen = (req) => {
    //Mueve la imagen de la carpeta uploading con en nombre que le da el usuario
    // a la carpeta Imagenes con el nombre pokemonid.extension
    fs.renameSync(directorio() + "/Uploading/" + req.file.originalname, 
    directorio() + "/Imagenes/" + req.body.id + "." +req.file.originalname.split(".")[1])
    path = "localhost:3001/Imagenes/" + req.body.id + "." + req.file.originalname.split(".")[1]
    return path
}

exports.reemplazarImagen = async (req,res) => {
    //Calculo en donde esta la imagen a reemplazar
    let path = directorio() + "/Imagenes/" + req.body.idVIejo
    try {
        //Me fijo si existe como .png, y si existe la borro
        if (fs.existsSync(path + ".png")) {
            fs.unlink(path + ".png")
        }
        //Me fijo si existe como .jpg, y si existe la borro
        else if (fs.existsSync(path + ".jpg")){
            fs.unlink(path + ".jpg")
        }
    }
    catch (error) {
        res.status(400).json({error: "File deleting error"})
    }
    //Muevo la imagen nueva
    ruta = this.moverImagen(req)
    return ruta
}