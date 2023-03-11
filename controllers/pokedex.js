const knex = require("../knexfile");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const {
  tipoANumero,
  moverImagen,
  reemplazarImagen,
} = require("../Utilities/Utilities");
const { directorio } = require("../Utilities/directorio");
var fs = require("fs");

//No se usa
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
//No se usa
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
  //Hace un request y devuelve un array con todos los pokemones
  knex("Pokemones")
    .join("Estadisticas", "Pokemones.id", "Estadisticas.id")
    .orderBy('Pokemones.id', "ASC")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.mostrarPokemonId = (req, res) => {
  //Hace un request y devuelve el pokemon con ese id
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

//No se usa
exports.subirImagen = (req, res) => {
  res.status(200).json({ error: "none" });
};

exports.addPokemon = (req, res, next) => {
  let pokemon = req.body;
  //Muevo la imagen de la carpeta uploading a la carpeta imagenes
  pokemon.foto = moverImagen(req);
  //Convierto height a un dato usable por la base de datos
  pokemon.height = parseFloat(
    String(pokemon.height)
      .slice(0, pokemon.height.length - 1)
      .replace(",", ".")
  );
  //Convierto weight a un dato usable por la base de datos
  pokemon.weight = parseFloat(
    String(pokemon.weight)
      .slice(0, pokemon.weight.length - 2)
      .replace(",", ".")
  );
  //Convierto habilidades de un string habilidad1/habilidad2/.... a un array [habilidad1, habilidad2, ...]
  habilidades = pokemon.abilities.split("/");
  pokemon.tipos = [];
  //Convierto el tipo a un numero ya que los tipos son numeros en la base de datos y estan guardados como un array
  //en el pokemon
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
  //Si el pokemon tiene 2 tipos convierto el segundo tipo y lo agrego tambien
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }
  //Por foreign keys estadistica se agrega primero
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
    //Convierto height a un dato usable por la base de datos
  pokemon.height = parseFloat(
    String(pokemon.height)
      .slice(0, pokemon.height.length - 1)
      .replace(",", ".")
  );
    //Convierto weight a un dato usable por la base de datos
  pokemon.weight = parseFloat(
    String(pokemon.weight)
      .slice(0, pokemon.weight.length - 2)
      .replace(",", ".")
  );
   //Convierto habilidades de un string habilidad1/habilidad2/.... a un array [habilidad1, habilidad2, ...]
  let habilidades = pokemon.abilities.split("/");
  //Muevo la foto de uploading a la carpeta imagenes, reemplazando la imagen existente
  reemplazarImagen(req).then((result) => {
    pokemon.foto = result
  })
  pokemon.tipos = [];
   //Convierto el tipo a un numero ya que los tipos son numeros en la base de datos y estan guardados como un array
  //en el pokemon
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
    //Si el pokemon tiene 2 tipos convierto el segundo tipo y lo agrego tambien
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }
  //Debido a foreign keys, pokemones se edita primero
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
  //Borra el pokemon cuyo id es req.params.id
  knex("Pokemones")
    .where("id", Number(req.params.id))
    .delete()
    .then(() => {
      //Borra la estadistica cuyo id es req.params.id
      knex("Estadisticas")
        .where("id", Number(req.params.id))
        .delete()
        .then(()=>{
          //Borro la imagen de la carpeta Imagenes
          path = directorio() + "/Imagenes/" + req.params.id
          //Me fijo si existe un .png
          if (fs.existsSync(path + ".png")){
            //Borro la imagen
            fs.unlink(path + ".png", (err) => {
              if (err) console.log(err);
              else {
                console.log("\nDeleted file: example_file.txt");
              }
            })
          }else
          //Me fijo si existe un .jpg
          if (fs.existsSync(path + "jpg", (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file: example_file.txt");
            }
          })){
            //Borro la imagen
            fs.unlink(path + ".jpg")
            res.status(200).json({message: "Pokemon borrado correctamente"})
          }else {
            //Si no encuentra la imagen regresa 404 pero indica que el pokemon se borro de la base de datos
            res.status(404).json({ message: "Imagen no encontrada, pero borrado de la base de datos." });
          }
          
        })
      
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
//No se usa desde el front
exports.addTipo = (req, res) => {
  //Permite agregar un tipo a la base de datos
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
//No se usa desde el front
exports.updateTipo = (req, res) => {
  //Permite editar un tipo de la base de datos
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
