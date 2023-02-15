const { validationResult, body, check, param } = require("express-validator");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado" });
  }
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.loginInfo = verified;
    if (verified.date < Date.now() - 5 * 60 * 1000) {
      res.status(401).json({ error: "Token expirado" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.runValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};

exports.usuarioValido = [
  body("username")
    .exists()
    .withMessage("No hay usuario")
    .isLength({ max: 20 })
    .withMessage("Username muy largo"),
];
exports.passwordValido = [
  body("password")
    .exists()
    .withMessage("No hay password")
    .isLength({ max: 63 })
    .withMessage("Username muy largo"),
];
exports.permisosValido = [
  body("permisos")
    .exists()
    .withMessage("No hay permisos")
    .isFloat({ min: 1, max: 3 })
    .isInt()
    .withMessage("El permiso tiene que ser un entero de valor 1, 2 o 3"),
];
