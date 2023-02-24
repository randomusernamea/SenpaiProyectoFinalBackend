const knex = require("../knexfile");
const {tipoANumero}    = require("../Utilities/Utilities")

exports.mostrarPokemones =  (req, res) => {
     knex("Pokemones")
        .join('tipos', 'pokemones.tipo_id', '=', 'tipos.id')
        .join('estadisticas', 'pokemones.id', '=', 'estadisticas.id')
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

exports.subirImagen = (req,res) => {
    res.status(200).json({'error': 'none'})
}

exports.addPokemon = (req, res) => {
  console.log(req.body)
  let pokemon = req.body;
  pokemon.height = parseFloat(String(pokemon.height).slice(0, pokemon.height.length-1).replace(",","."))
  pokemon.weight = parseFloat(String(pokemon.weight).slice(0, pokemon.weight.length-2).replace(",","."))
  habilidades = pokemon.abilities.split("/");
  pokemon.tipos = []
  pokemon.tipos.push(tipoANumero(pokemon.tipo1))
  if (pokemon.tipo2) {pokemon.tipos.push(tipoANumero(pokemon.tipo2))}
   knex("Estadisticas")
     .insert({
        id: pokemon.id,
        hp: pokemon.stats.hp,
        atk: pokemon.stats.atk,
        def: pokemon.stats.def,
        satk: pokemon.stats.satk,
        sdef: pokemon.stats.sdef,
        spd: pokemon.stats.spd
    })
    .then(() => {
      knex("Pokemones")
          .insert({
              id: Number(pokemon.id),
              tipo_id: pokemon.tipos,
              nombre: pokemon.nombre,
              foto: "",
              peso: pokemon.weight,
              altura: pokemon.height,
              habilidad: habilidades, //todo Cambiar por habilidades cuando este en la base de datos
              descripcion: "pokemon.descripcion",
          })
          .then(() => {   
              console.log("entro 3")
              res.status(200).json({ error: null, data: "Se agrego correctamente", pokemon })
          })
          .catch((error) => {
              res.status(400).json({ error: error.message })
          })
    })
    .catch((error) => {
        console.log(error)
        res.status(400).json("ASDASDSAD")
    })
}

exports.updatePokemon = (req, res) => {
  const pokemon = req.body;
  pokemon.height = parseFloat(String(pokemon.height).slice(0, pokemon.height.length-1).replace(",","."))
  pokemon.weight = parseFloat(String(pokemon.weight).slice(0, pokemon.weight.length-2).replace(",","."))
  habilidades = pokemon.abilities.split("/");
  pokemon.tipos = [];
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }

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
    .where(id, pokemon.id)
    .then(() => {
      console.log("entro 2");
      knex("Pokemones")
        .update({
          id: pokemon.id,
          tipo_id: pokemon.tipos,
          nombre: pokemon.nombre,
          foto: pokemon.img,
          peso: pokemon.weight,
          altura: pokemon.height,
          habilidad: habilidades, //todo Cambiar por habilidades cuando este en la base de datos
          descripcion: pokemon.descripcion,
        })
        .where(id, pokemon.id)
        .then(() => {
          console.log("entro 3");
          res
          .status(200)
          .json({ error: null, data: "Se agrego correctamente", pokemon });
        })
        .catch((error) => {
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

exports.addTipo = (req,res) => {
  let tipo = req.body;
  knex("Tipos")
    .insert({
        id: tipo.id,
        nombre: tipo.nombre
    })
    .then(() => {   
        res.status(200).json({error: "No errors"})
    })
    .catch((error) => { 
        res.status(400).json({ error: error.message })
    })
}

exports.updateTipo = (req,res) => {
  let tipo = req.body;
  knex("Tipos")
    .update({
        id: tipo.id,
        nombre: tipo.nombre
    })
    .where(id, tipo.id)
    .then(() => {   
        res.status(200).json({error: "No errors"})
    })
    .catch((error) => {
        res.status(400).json({ error: error.message })
    })
}   