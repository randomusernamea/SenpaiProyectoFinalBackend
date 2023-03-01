const { validationResult, body, check, param } = require("express-validator");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const jwt = require("jsonwebtoken");
const { esTipo, tipoANumero } = require("../Utilities/Utilities");
var fs = require("fs");
const { directorio } = require("../Utilities/directorio");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado, se requiere un token" });
  }
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.loginInfo = verified;
    if (verified.date < Date.now() - 5 * 60 * 1000) {
      res.status(401).json({ error: "Token expirado" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "El token no es válido" + error.message });
  }
};

exports.isAdmin = (req, res, next) => {
  verifyToken();
  if (req.loginInfo.permisos === 1) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "No tiene los permisos para realizar esta acción" });
  }
};

exports.imagenNoExiste = (req, res, next) => {
  //FormData no acepta JSON, por eso viene string y hay que hacerle parse
  const id = req.body.id;
  let path = directorio() + "/Imagenes/" + id;
  //Se fija si existe la imagen en la carpeta imagenes
  if (fs.existsSync(path + ".png")) {
    res.status(400).json({
      error:
        "Ya existe una imagen para ese pokemon y por ende, el pokemon ya existe",
    });
    //Si existe la imagen se borra de la carpeta uploading
    fs.unlink(directorio() + "/Uploading/" + req.file.originalname, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nDeleted file: example_file.txt");
      }
    });
  } else {
    if (fs.existsSync(path + ".jpg")) {
      //Similar pero por si la imagen es in .jpg y no un .png
      res.status(400).json({
        error:
          "Ya existe una imagen para ese pokemon y por ende, el pokemon ya existe",
      });
      fs.unlink(directorio() + "/Uploading/" + req.file.originalname, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file: example_file.txt");
        }
      });
    } else {
      //Pongo en el body el path de la imagen por si se necesita despues
      req.body.ImgPath = path;
      next();
    }
  }
};

exports.imagenExiste = (req, res, next) => {
  //Arreglar Path?
  let path = "../Imagenes/" + req.body.id;
  //Arreglar linea
  req.body.img.nombre = req.body.id;
  if (!fs.existsSync(path)) {
    res.status(400).json({ error: "Archivo ya existe" });
  }
  next();
};

exports.pokemonTipoValido = (req, res, next) => {
  const { tipo1, tipo2 } = req.body;
  if (!esTipo(tipo1) || (tipo2 && !esTipo(tipo2))) {
    res.status(400).send("Tipos invalidos");
  }
  next();
};

exports.pokemonValidator = (req, res, next) => {};

exports.runValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};

exports.correoValido = [
  body("correo")
    .exists()
    .withMessage("No hay usuario")
    .isLength({ max: 20 })
    .withMessage("Correo muy largo"),
];

exports.claveValido = [
  body("clave")
    .exists()
    .withMessage("No hay clave")
    .isLength({ max: 63 })
    .withMessage("Clave muy larga"),
];

exports.permisosValido = [
  body("permisos")
    .exists()
    .withMessage("No hay permisos")
    .isFloat({ min: 1, max: 3 })
    .isInt()
    .withMessage("El permiso tiene que ser un entero de valor 1, 2 o 3"),
];

exports.pokemonNombreValido = [
  body("nombre")
    .exists()
    .withMessage("No hay nombre")
    .isAlpha()
    .withMessage("Los nombres solo pueden contener letras")
    .isLength({ min: 1, max: 30 })
    .withMessage("Nombre muy largo"),
];

//Needs testing
exports.pokemonHeightValido = [
  body("height")
    .exists()
    .withMessage("No hay height")
    .matches(/^[0-9]+[,]+[0-9]+[m]$/g)
    .withMessage(
      "Height tiene que ser un numero positivo hasta 2000 y terminar en m"
    ),
];

//Needs testing
exports.pokemonWeightValido = [
  body("weight")
    .exists()
    .withMessage("No hay weight")
    .matches(/^[0-9]+[,]+[0-9]+[k]+[g]$/g)
    .withMessage(
      "Weight tiene que ser un numero positivo hasta 2000 y terminar en kg"
    ),
];

exports.pokemonIdValido = [
  body("id")
    .exists()
    .withMessage("No hay id")
    .isInt({ min: 0, max: 1300 })
    .withMessage("La id tiene que ser numerica entre 0 y 1300"),
];

exports.pokemonHpValido = [
  body("stats.hp")
    .exists()
    .withMessage("No hay HP")
    .isInt({ min: 1, max: 255 })
    .withMessage("Los HP tienen que ser un entero entre 1 y 255"),
];

exports.pokemonAtkValido = [
  body("stats.atk")
    .exists()
    .withMessage("No hay atk")
    .isInt({ min: 1, max: 255 })
    .withMessage("El atk tiene que ser un entero entre 1 y 255"),
];

exports.pokemonDefValido = [
  body("stats.def")
    .exists()
    .withMessage("No hay def")
    .isInt({ min: 1, max: 255 })
    .withMessage("La def tiene que ser un entero entre 1 y 255"),
];

exports.pokemonSatkValido = [
  body("stats.satk")
    .exists()
    .withMessage("No hay satk")
    .isInt({ min: 1, max: 255 })
    .withMessage("El satk tiene que ser un entero entre 1 y 255"),
];

exports.pokemonSdefValido = [
  body("stats.sdef")
    .exists()
    .withMessage("No hay sdef")
    .isInt({ min: 1, max: 255 })
    .withMessage("La sdef tiene que ser un entero entre 1 y 255"),
];

exports.pokemonSpdValido = [
  body("stats.spd")
    .exists()
    .withMessage("No hay spd")
    .isInt({ min: 1, max: 255 })
    .withMessage("La spd tiene que ser un entero entre 1 y 255"),
];
