const { validationResult, body, check, param } = require("express-validator")
const jwt = require("jsonwebtoken")


exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado' })
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.loginInfo = verified
        if (verified.date < (Date.now() - (5 * 60 * 1000))) {
            res.status(401).json({ error: 'Token expirado' })
        }
        next()
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.runValidate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg })
    }
    next();
}

exports.usuarioValido = [
    body("nombre")
        .exists()
        .withMessage("No hay usuario")
        .isLength({ max: 20 })
        .withMessage("Nombre muy largo")
]
exports.correoValido = [
    body("correo")
        .exists()
        .withMessage("No hay correo")
        .isLength({ max: 20 })
        .withMessage("Correo muy largo")
]
exports.passwordValido = [
    body("clave")
        .exists()
        .withMessage("No hay password")
        .isLength({ max: 63 })
        .withMessage("Clave muy larga")
]
exports.permisosValido = [
    body("permisos")
        .exists()
        .withMessage("No hay permisos")
        .isFloat({ min: 1, max: 3 })
        .isInt()
        .withMessage("El permiso tiene que ser un entero de valor 1, 2 o 3")
]
const { check } = require("express-validator")

exports.pokemonValidator = [
    check("tipo_id")
        .not()
        .isEmpty()
        .withMessage("El campo tipo id debe ser ingresado")
        .isNumeric()
        .withMessage("El campo tipo id debe ser numerico"),
    check("nombre")
        .not()
        .isEmpty()
        .withMessage("El campo nombre debe ser ingresado")
        .isString()
        .withMessage("El campo nombre debe ser un texto"),
    check("peso")
        .not()
        .isEmpty()
        .withMessage("El campo peso debe ser ingresado")
        .isNumeric()
        .withMessage("El campo peso debe ser numerico"),
    check("altura")
        .not()
        .isEmpty()
        .withMessage("El campo altura debe ser ingresado")
        .isNumeric()
        .withMessage("El campo altura debe ser numerico"),
    check("habilidad")
        .not()
        .isEmpty()
        .withMessage("El campo habilidad debe ser ingresado")
        .isString()
        .withMessage("El campo habilidad debe ser texto"),
    check("descripcion")
        .not()
        .isEmpty()
        .withMessage("El campo descripcion debe ser ingresado")
        .isString()
        .withMessage("El campo descripcion debe ser texto"),
]

exports.estadisticaValidator = [
    check("id")
        .not()
        .isEmpty()
        .withMessage("El campo id debe ser ingresado")
        .isNumeric()
        .withMessage("El campo id debe ser numerico"),
    check("hp")
        .not()
        .isEmpty()
        .withMessage("El campo hp debe ser ingresado")
        .isNumeric()
        .withMessage("El campo hp debe ser numerico"),
    check("atk")
        .not()
        .isEmpty()
        .withMessage("El campo atk debe ser ingresado")
        .isNumeric()
        .withMessage("El campo atk debe ser numerico"),
    check("def")
        .not()
        .isEmpty()
        .withMessage("El campo def debe ser ingresado")
        .isNumeric()
        .withMessage("El campo def debe ser numerico"),
    check("satk")
        .not()
        .isEmpty()
        .withMessage("El campo satk debe ser ingresado")
        .isNumeric()
        .withMessage("El campo satk debe ser numerico"),
    check("sdef")
        .not()
        .isEmpty()
        .withMessage("El campo sdef debe ser ingresado")
        .isNumeric()
        .withMessage("El campo sdef debe ser numerico"),
    check("spd")
        .not()
        .isEmpty()
        .withMessage("El campo spd debe ser ingresado")
        .isNumeric()
        .withMessage("El campo spd debe ser numerico"),

]

exports.tipoPokemonValidator = [
    check("id")
        .not()
        .isEmpty()
        .withMessage("El campo id debe ser ingresado")
        .isNumeric()
        .withMessage("El campo id debe ser numerico"),
    check("nombre")
        .not()
        .isEmpty()
        .withMessage("El campo nombre debe ser ingresado")
        .isString()
        .withMessage("El campo nombre debe ser un texto"),
]
