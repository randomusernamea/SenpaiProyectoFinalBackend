const { validationResult, body, check, param } = require("express-validator");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const jwt = require("jsonwebtoken");


exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    //Si el token no existe lo rechazo
    return res.status(401).json({ error: "Acceso denegado" });
  }
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    //Me guardo la informacion del token en req.loginInfo
    req.loginInfo = verified;
    //Si el token es viejo (mas de 5m) lo rechazo
    if (verified.date < Date.now() - 5 * 60 * 1000) {
      res.status(401).json({ error: "Token expirado" });
    }else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.isAdmin = (req, res, next) => {
  //Permisos 1 es que es administrador, por ahora la aplicacion asigna que cualquier persona sea administrador
  if (req.loginInfo.permisos === 1) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "No tiene los permisos para realizar esta acción" });
  }
};

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
exports.nombreValido = [
  body("nombre")
    .exists()
    .withMessage("No hay nombre")
    .isAlpha('en-US', {ignore: ' '})
    .withMessage("El nombre solo puede contener caracteres Alpha")
]