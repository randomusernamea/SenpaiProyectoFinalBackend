const express = require("express");
const router = express.Router();

const {register, login} = require('../controllers/pokedex')
const {correoValido, passwordValido, permisosValido, runValidate} = require('../validators/middleware')

const {
  mostrarPokemones,
  buscarPokemon,
  addPokemon,
  login,
  register,
  deletePokemon,
} = require("../controllers/pokedex");

const {
  usuarioValido,
  passwordValido,
  permisosValido,
  runValidate,
} = require("../validators/middleware");

router.get("/listaPokemones", mostrarPokemones);
router.get("/listaPokemones/:id", buscarPokemon);

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

router.delete("/pokemones/delete/:id", deletePokemon);

module.exports = router;
