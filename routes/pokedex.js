const express = require("express");
const router = express.Router();

const { register, login, mostrarPokemones, logout, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon, updateEstadistica } = require('../controllers/pokedex')
const { pokemonHeightValido, pokemonWeightValido, pokemonTipoValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHpValido, pokemonIdValido, pokemonNombreValido, claveValido, permisosValido, runValidate, correoValido, pokemonValidator, estadisticaValidator, tipoPokemonValidator } = require('../validators/middleware')

//Routes Pokemones
router.get("/listaPokemones", mostrarPokemones);
router.post("/pokemon/nuevo", pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido,runValidate, pokemonTipoValido,  addPokemon);
router.put("/pokemon/editar", pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido,runValidate, pokemonTipoValido, updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/estadistica/nuevo", /*estadisticaValidator,*/ runValidate, addEstadisticaPokemon);
router.put("/estadistica/editar", /*estadisticaValidator,*/ runValidate, updateEstadistica);
router.post("/tipo/nuevo", /*tipoPokemonValidator,*/ runValidate, addTipoPokemon);

//Routes Users
router.post("/login", correoValido, claveValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", correoValido, correoValido, claveValido, permisosValido, runValidate, register);


module.exports = router