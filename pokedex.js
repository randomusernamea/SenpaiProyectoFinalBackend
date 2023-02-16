const express = require("express");
const router = express.Router();

const { register, login, mostrarPokemones, logout, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon, updateEstadistica } = require('../controllers/pokedex')
const { usuarioValido, passwordValido, permisosValido, runValidate, correoValido } = require('../validators/middleware')

//Routes Pokemones
router.get("/listaPokemones", mostrarPokemones);
router.post("/pokemon/nuevo", addPokemon);
router.put("/pokemon/editar", updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/estadistica/nuevo", addEstadisticaPokemon);
router.put("/estadistica/editar", updateEstadistica);
router.post("/tipo/nuevo", addTipoPokemon);

//Routes Users
router.post("/login", correoValido, passwordValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", usuarioValido, correoValido, passwordValido, permisosValido, runValidate, register);


