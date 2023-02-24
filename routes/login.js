const express = require("express");
const router = express.Router();

const { register, login, logout} = require('../controllers/pokedex')
const { claveValido, permisosValido, runValidate, correoValido } = require('../validators/middleware')





router.post("/login", correoValido, claveValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", correoValido, correoValido, claveValido, permisosValido, runValidate, register);


module.exports = router