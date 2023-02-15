const express = require("express");
const router = express.Router();

const {register, login} = require('../controllers/pokedex')
const {correoValido, passwordValido, permisosValido, runValidate} = require('../validators/middleware')

router.post("/login", correoValido, passwordValido, runValidate, login)
router.post("/register",correoValido, passwordValido, permisosValido, runValidate, register)


module.exports = router;