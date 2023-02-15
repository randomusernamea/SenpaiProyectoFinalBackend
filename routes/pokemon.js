const express = require("express");
const router = express.Router();
const { mostrarPokemones } = require("../controllers/pokemon");

router.get("/listaPokemones", mostrarPokemones);

module.exports = router;
