const express = require("express");
const router = express.Router();

const { register, login, logout} = require('../controllers/login')
const { nombreValido, claveValido, permisosValido, correoValido } = require('../validators/login')
const {runValidate} = require('../validators/middleware')

router.post("/register", nombreValido, correoValido, claveValido, permisosValido, runValidate, register);
router.post("/login", correoValido, claveValido, runValidate, login);
router.post("/logout", logout);

module.exports = router