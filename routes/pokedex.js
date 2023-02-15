const express = require("express");
const router = express.Router();

const {
  mostrarPokemones,
  buscarPokemon,
  register,
  login,
} = require("../controllers/pokedex");
const {
  usuarioValido,
  passwordValido,
  permisosValido,
  runValidate,
} = require("../validators/middleware");

router.get("/listaPokemones", mostrarPokemones);
router.get("/listaPokemones/:id", buscarPokemon);
router.post("/login", usuarioValido, passwordValido, runValidate, login);
router.post(
  "/register",
  usuarioValido,
  passwordValido,
  permisosValido,
  runValidate,
  register
);

module.exports = router;
