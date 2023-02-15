const express = require("express");
const router = express.Router();

const {register, login} = require('../controllers/pokedex')
const {usuarioValido, passwordValido, permisosValido, runValidate} = require('../validators/middleware')

router.post("/login", usuarioValido, passwordValido, runValidate, login)
router.post("/register",usuarioValido, passwordValido, permisosValido, runValidate, register)


