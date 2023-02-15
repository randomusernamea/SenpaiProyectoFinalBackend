const express = require("express");
const router = express.Router();

const {
  mostrarPokemones,
  buscarPokemon, 
  addPokemon,
  register,
  login,
} = require("../controllers/pokedex");

const {
  usuarioValido,
  passwordValido,
  permisosValido,
  runValidate,
} = require("../validators/middleware");

router.post("/pokemones/addPokemon", addPokemon);
router.post("/login", usuarioValido, passwordValido, runValidate, login);
router.post(
  "/register",
  usuarioValido,
  passwordValido,
  permisosValido,
  runValidate,
  register
);

router.get("/listaPokemones", mostrarPokemones);
router.get("/listaPokemones/:id", buscarPokemon);

module.exports = router;
