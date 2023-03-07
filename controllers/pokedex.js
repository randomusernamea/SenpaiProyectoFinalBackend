const knex = require("../knexfile");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const {
  tipoANumero,
  moverImagen,
  reemplazarImagen,
} = require("../Utilities/Utilities");


exports.getPrev = (req,res) => {
  knex("Pokemones")
    .max("id")
    .where("id", "<" ,req.params.id)
    .then((resultado) => {
      if (resultado[0].max != null ){
        res.status(200).json(resultado)
      }
      else {
        knex("Pokemones")
          .max("id")
          .then((resultado) => {
            res.status(200).json(resultado)
          })
      }
      
    })
    .catch((error) => {
      console.log(error)
      res.status(400)
    })
}
exports.getNext = (req,res) => {
  knex("Pokemones")
  .min("id")
  .where("id", ">" ,req.params.id)
  .then((resultado) => {
    if (resultado[0].min != null ){
      res.status(200).json(resultado)
    }
    else {
      knex("Pokemones")
        .min("id")
        .then((resultado) => {
          res.status(200).json(resultado)
        })
    }
    
  })
  .catch((error) => {
    console.log(error)
    res.status(400)
  })
}

exports.mostrarPokemones = (req, res) => {
  knex("Pokemones")
    .join("Estadisticas", "Pokemones.id", "Estadisticas.id")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.mostrarPokemonId = (req, res) => {
  knex("Pokemones")
    .where("Pokemones.id", req.params.id)
    .join("Estadisticas", "Pokemones.id", "Estadisticas.id")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ error: error.message });
    });
};

exports.subirImagen = (req, res) => {
  res.status(200).json({ error: "none" });
};

exports.addPokemon = (req, res, next) => {
  let pokemon = req.body;
  pokemon.foto = moverImagen(req);
  pokemon.height = parseFloat(
    String(pokemon.height)
      .slice(0, pokemon.height.length - 1)
      .replace(",", ".")
  );
  pokemon.weight = parseFloat(
    String(pokemon.weight)
      .slice(0, pokemon.weight.length - 2)
      .replace(",", ".")
  );
  habilidades = pokemon.abilities.split("/");
  pokemon.tipos = [];
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }
  knex("Estadisticas")
    .insert({
      id: pokemon.id,
      hp: pokemon.stats.hp,
      atk: pokemon.stats.atk,
      def: pokemon.stats.def,
      satk: pokemon.stats.satk,
      sdef: pokemon.stats.sdef,
      spd: pokemon.stats.spd,
    })
    .then(() => {
      knex("Pokemones")
        .insert({
          id: Number(pokemon.id),
          tipo_id: pokemon.tipos,
          nombre: pokemon.nombre,
          foto: pokemon.foto,
          peso: pokemon.weight,
          altura: pokemon.height,
          habilidad: habilidades, //todo Cambiar por habilidades cuando este en la base de datos
          descripcion: "pokemon.descripcion",
        })
        .then(() => {
          res
            .status(200)
            .json({ error: null, data: "Se agrego correctamente", pokemon });
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json("ASDASDSAD");
    });
};

exports.updatePokemon = (req, res) => {
  const pokemon = req.body;
  pokemon.height = parseFloat(
    String(pokemon.height)
      .slice(0, pokemon.height.length - 1)
      .replace(",", ".")
  );
  pokemon.weight = parseFloat(
    String(pokemon.weight)
      .slice(0, pokemon.weight.length - 2)
      .replace(",", ".")
  );
  let habilidades = pokemon.abilities.split("/");
  reemplazarImagen(req).then((result) => {
    pokemon.foto = result
  })
  pokemon.tipos = [];
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }
  knex("Pokemones")
    .update({
      id: pokemon.id,
      tipo_id: pokemon.tipos,
      nombre: pokemon.nombre,
      foto: pokemon.foto,
      peso: pokemon.weight,
      altura: pokemon.height,
      habilidad: habilidades,
      descripcion: pokemon.descripcion,
      fk_estadistica: pokemon.id,
    })
    .where("id", pokemon.idViejo)
    .then(() => {
      knex("Estadisticas")
        .update({
          id: pokemon.id,
      hp: pokemon.stats.hp,
      atk: pokemon.stats.atk,
      def: pokemon.stats.def,
      satk: pokemon.stats.satk,
      sdef: pokemon.stats.sdef,
      spd: pokemon.stats.spd,
        })
        .where("id", pokemon.idViejo)
        .then(() => {
          res
            .status(200)
            .json({ error: null, data: "Se agrego correctamente", pokemon });
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json("ASDASDSAD");
    });
};

exports.deletePokemon = (req, res) => {
  knex("Pokemones")
    .where("id", Number(req.params.id))
    .del()
    .then(() => {
      res.status(200).json({ message: "borrado correctamente" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.addTipo = (req, res) => {
  let tipo = req.body;
  knex("Tipos")
    .insert({
      id: tipo.id,
      nombre: tipo.nombre,
    })
    .then(() => {
      res.status(200).json({ error: "No errors" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.updateTipo = (req, res) => {
  let tipo = req.body;
  knex("Tipos")
    .update({
      id: tipo.id,
      nombre: tipo.nombre,
    })
    .where("id", tipo.id)
    .then(() => {
      res.status(200).json({ error: "No errors" });
    })
    .catch((error) => {
      anyErrors = true;
      res.status(400).json({ error: error.message });
    });
};
