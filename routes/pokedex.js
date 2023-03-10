const express = require("express");
const router = express.Router();


const { getPrev, getNext, mostrarPokemones, mostrarPokemonId, addPokemon, updatePokemon, deletePokemon, addTipo, updateTipo } = require("../controllers/pokedex");
const { pokemonHeightValido, pokemonWeightValido, pokemonTipoValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHpValido, pokemonIdValido, pokemonNombreValido, runValidate, imagenExiste, imagenNoExiste} = require("../validators/middleware");
const { isAdmin, verifyToken} = require("../validators/login")

const { reparseFormToBody } = require("../validators/reparsers");
const { directorio } = require("../Utilities/directorio");

//Multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directorio() + "/Uploading");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//Routes Pokemones
router.get("/pokedex", mostrarPokemones);
router.post("/pokemon/nuevo", upload.single('Imagen'),reparseFormToBody, verifyToken, isAdmin, imagenNoExiste,pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido, runValidate, pokemonTipoValido, addPokemon);
router.put("/pokemon/editar", upload.single('Imagen'), reparseFormToBody, verifyToken, isAdmin ,imagenExiste, pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido, runValidate, pokemonTipoValido, updatePokemon);
router.get("/pokedex/:id", mostrarPokemonId)
router.delete("/pokemon/eliminar/:id", deletePokemon);
router.post("/tipos/nuevo", pokemonTipoValido, verifyToken, isAdmin, addTipo);
router.put("/tipos/editar", pokemonTipoValido, verifyToken, isAdmin, updateTipo);
router.get("/pokedex/prev/:id", getPrev)
router.get("/pokedex/next/:id", getNext)

module.exports = router;
