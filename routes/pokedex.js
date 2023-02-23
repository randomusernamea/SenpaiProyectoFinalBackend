const express = require("express");
const router = express.Router();

const { addTipo, updateTipo, register, login, mostrarPokemones, logout, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon, updateEstadistica } = require('../controllers/pokedex')
const { pokemonHeightValido, pokemonWeightValido, pokemonTipoValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHpValido, pokemonIdValido, pokemonNombreValido, claveValido, permisosValido, runValidate, correoValido, imagenExiste, imagenNoExiste, pokemonValidator, estadisticaValidator, tipoPokemonValidator } = require('../validators/middleware')

//Multer
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Imagenes/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage: storage })



//Routes Pokemones
router.get("/listaPokemones", mostrarPokemones);
router.post("/pokemon/nuevo", pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido,runValidate, pokemonTipoValido, imagenNoExiste, upload.single('imagen'), addPokemon);
router.put("/pokemon/editar", pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido,runValidate, pokemonTipoValido, imagenExiste, upload.single('imagen'), updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/tipos/nuevo", pokemonTipoValido, addTipo)
router.put("/tipos/editar", pokemonTipoValido, updateTipo)


//Routes Users
router.post("/login", correoValido, claveValido, runValidate, login);
router.post("/logout", logout);
router.post("/register", correoValido, correoValido, claveValido, permisosValido, runValidate, register);


module.exports = router