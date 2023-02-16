const express = require("express");
const router = express.Router();

const { register, login, mostrarPokemones, logout, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon } = require('../controllers/pokedex')
const { usuarioValido, passwordValido, permisosValido, runValidate, correoValido } = require('../validators/middleware')

//Routes Pokemones
router.get("/listaPokemones", mostrarPokemones);
router.post("/pokemon/nuevo", addPokemon);
router.put("/pokemo/editar", updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/estadistica/nuevo", addEstadisticaPokemon);
router.post("/tipo/nuevo", addTipoPokemon);

//Routes Users
router.post("/login", correoValido, passwordValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", correoValido, correoValido, passwordValido, permisosValido, runValidate, register);


module.exports = router