const knew = require("../config/knexfile");

exports.mostrarPokemones = (req, res) => {
  knex("pokemones")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
