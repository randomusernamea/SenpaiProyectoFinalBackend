const express = require("express");
const router = express.Router();

const { register, login, mostrarPokemones, logout, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon, updateEstadistica } = require('../controllers/pokedex')
const { claveValido, permisosValido, runValidate, correoValido, pokemonValidator, estadisticaValidator, tipoPokemonValidator } = require('../validators/middleware')

//Routes Pokemones
router.get("/listaPokemones", mostrarPokemones);
router.post("/pokemon/nuevo", pokemonValidator, runValidate, addPokemon);
router.put("/pokemon/editar", pokemonValidator, runValidate, updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/estadistica/nuevo", estadisticaValidator, runValidate, addEstadisticaPokemon);
router.put("/estadistica/editar", estadisticaValidator, runValidate, updateEstadistica);
router.post("/tipo/nuevo", tipoPokemonValidator, runValidate, addTipoPokemon);

//Routes Users
router.post("/login", correoValido, claveValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", correoValido, correoValido, claveValido, permisosValido, runValidate, register);


