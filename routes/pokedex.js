const express = require("express");
const router = express.Router();

const { register, login, mostrarPokemones, logout, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon, updateEstadistica } = require('../controllers/pokedex')
const { usuarioValido, passwordValido, permisosValido, runValidate, correoValido, pokemonValidator, estadisticaValidator, tipoPokemonValidator } = require('../validators/middleware')

//Routes Pokemones
router.get("/listaPokemones", mostrarPokemones);
router.post("/pokemon/nuevo", pokemonValidator, runValidate, addPokemon);
router.put("/pokemon/editar", pokemonValidator, runValidate, updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/estadistica/nuevo", estadisticaValidator, runValidate, addEstadisticaPokemon);
router.put("/estadistica/editar", estadisticaValidator, runValidate, updateEstadistica);
router.post("/tipo/nuevo", tipoPokemonValidator, runValidate, addTipoPokemon);

//Routes Users
router.post("/login", correoValido, passwordValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", usuarioValido, correoValido, passwordValido, permisosValido, runValidate, register);


