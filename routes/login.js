const express = require("express");
const router = express.Router();

const { register, login, logout} = require('../controllers/login')
const { claveValido, permisosValido, correoValido } = require('../validators/login')
const {runValidate} = require('../validators/middleware')





router.post("/login", correoValido, claveValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", correoValido, correoValido, claveValido, permisosValido, runValidate, register);


module.exports = router