const express = require("express");
const router = express.Router();

const { addTipo, updateTipo, mostrarPokemones, addPokemon, updatePokemon, deletePokemon, addTipoPokemon, addEstadisticaPokemon, updateEstadistica } = require('../controllers/pokedex')
const { pokemonHeightValido, pokemonWeightValido, pokemonTipoValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHpValido, pokemonIdValido, pokemonNombreValido, claveValido, permisosValido, runValidate, correoValido, imagenExiste, imagenNoExiste, pokemonValidator, estadisticaValidator, tipoPokemonValidator } = require('../validators/middleware')
const {reparseFormToBody} = require('../validators/reparsers')
const {directorio} = require('../Utilities/directorio')

//Multer
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, directorio()) 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})  
const upload = multer({ storage: storage })   



//Routes Pokemones  
router.get("/listaPokemones", mostrarPokemones);  
router.post("/pokemon/nuevo", imagenNoExiste, upload.single('Imagen'), reparseFormToBody,pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido,runValidate, pokemonTipoValido, addPokemon);
router.put("/pokemon/editar", pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido,runValidate, pokemonTipoValido, imagenExiste, upload.single('img'), updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/tipos/nuevo", pokemonTipoValido, addTipo)
router.put("/tipos/editar", pokemonTipoValido, updateTipo)


//Routes Users



module.exports = router