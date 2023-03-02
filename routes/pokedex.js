const express = require("express");
const router = express.Router();


const { mostrarPokemones, mostrarPokemonId, addPokemon, updatePokemon, deletePokemon, addTipo, updateTipo } = require("../controllers/pokedex");
const { pokemonHeightValido, pokemonWeightValido, pokemonTipoValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHpValido, pokemonIdValido, pokemonNombreValido, runValidate, imagenExiste, imagenNoExiste, verifyToken, isAdmin } = require("../validators/middleware");

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
router.get("/getPokedex", verifyToken, isAdmin, mostrarPokemones);
router.get("/getPokedex/:id", mostrarPokemonId);
router.post("/pokemon/nuevo", upload.single("Imagen"), reparseFormToBody, imagenNoExiste, pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido, runValidate, pokemonTipoValido, addPokemon);
router.put("/pokemon/editar", upload.single("Imagen"), reparseFormToBody, imagenExiste, pokemonNombreValido, pokemonIdValido, pokemonHpValido, pokemonAtkValido, pokemonDefValido, pokemonSpdValido, pokemonSatkValido, pokemonSdefValido, pokemonHeightValido, pokemonWeightValido, runValidate, pokemonTipoValido, updatePokemon);
router.delete("/pokemon/eliminar/:id", deletePokemon);

router.post("/tipos/nuevo", pokemonTipoValido, addTipo);
router.put("/tipos/editar", pokemonTipoValido, updateTipo);

module.exports = router;
