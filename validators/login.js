const { validationResult, body, check, param } = require("express-validator");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const jwt = require("jsonwebtoken");


exports.correoValido = [
  body("correo")
    .exists()
    .withMessage("No hay usuario")
    .isEmail()
    .withMessage("El email mandado no es un email valido")
    .isLength({max:55})
    .withMessage("Correo muy largo")]

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