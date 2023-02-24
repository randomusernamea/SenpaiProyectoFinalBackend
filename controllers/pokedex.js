const knex = require("../knexfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";
const tipoANumero = require("../Utilities/Utilities");

exports.mostrarPokemones = (req, res) => {
  knex("Pokemones")
    .join("tipos", "pokemones.tipo_id", "=", "tipos.id")
    .join("estadisticas", "pokemones.id", "=", "estadisticas.id")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.mostrarPokemonId = (req, res) => {
  knex("Pokemones")
    .where("id", Number(req.params.id))
    .join("tipos", "pokemones.tipo_id", "=", "tipos.id")
    .join("estadisticas", "pokemones.id", "=", "estadisticas.id")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.subirImagen = (req, res) => {
  res.status(200).json({ error: "none" });
};

exports.addPokemon = (req, res) => {
  console.log(req.body);
  let pokemon = req.body;
  pokemon.height = Number(
    pokemon.height.slice(0, pokemon.height.lenght - 1).replace(",", ".")
  );
  pokemon.weight = Number(
    pokemon.weight.slice(0, pokemon.weight.lenght - 1).replace(",", ".")
  );
  habilidades = pokemon.abilities.split("/");
  pokemon.tipos = [];
  console.log(pokemon.tipos);
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }
  let anyErrors = false;
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
      console.log("entro 2");
      knex("Pokemones")
        .insert({
          id: pokemon.id,
          tipo_id: pokemon.id,
          nombre: pokemon.nombre,
          foto: pokemon.img,
          peso: pokemon.weight,
          altura: pokemon.height,
          habilidad: habilidades, //todo Cambiar por habilidades cuando este en la base de datos
          descripcion: pokemon.descripcion,
        })
        .then(() => {
          console.log("entro 3");
        })
        .catch((error) => {
          anyErrors = true;
          res.status(400).json({ error: error.message });
        });
      if (!anyErrors) {
        res
          .status(200)
          .json({ error: null, data: "Se agrego correctamente", pokemon });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json("ASDASDSAD");
    });
  if (anyErrors) {
    res.status(400).json({ error: "Uncatchted error" });
  }
};

exports.updatePokemon = (req, res) => {
  const pokemon = req.body;
  pokemon.height = Number(
    pokemon.height.slice(0, pokemon.height.lenght - 1).replace(",", ".")
  );
  pokemon.weight = Number(
    pokemon.weight.slice(0, pokemon.weight.lenght - 1).replace(",", ".")
  );
  habilidades = pokemon.abilities.split("/");

  pokemon.tipos = [];
  console.log(pokemon.tipos);
  pokemon.tipos.push(tipoANumero(pokemon.tipo1));
  if (pokemon.tipo2) {
    pokemon.tipos.push(tipoANumero(pokemon.tipo2));
  }
  let anyErrors = false;

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
        })
        .catch((error) => {
          anyErrors = true;
          res.status(400).json({ error: error.message });
        });
      if (!anyErrors) {
        res
          .status(200)
          .json({ error: null, data: "Se agrego correctamente", pokemon });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json("ASDASDSAD");
    });
  if (anyErrors) {
    res.status(400).json({ error: "Uncatchted error" });
  }
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

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  console.log(req.body);
  await knex("Usuarios")
    .select("*")
    .where("correo", correo)
    .then(function (data) {
      if (data.length != 1) {
        res.status(400).json("Usuario o contrasena incorrectos");
      }
      const user = data[0];
      const validPassword = bcrypt.compareSync(clave, user.clave);
      if (validPassword) {
        const token = jwt.sign(
          {
            correo: user.correo,
            nombre: user.nombre,
            permisos: user.permisos,
            date: Date.now(),
          },
          SECRET_KEY
        );
        res.status(200).json({ error: null, data: "Login exitoso", token });
      } else {
        return res
          .status(400)
          .json({ error: "Usuario o contrasena incorrectos" });
      }
    });
};

exports.logout = (req, res) => {
  if (req.session) {
    req.session.delete((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.send("Logout successful");
      }
    });
  } else {
    res.end();
  }
};

exports.register = async (req, res) => {
  let { nombre, correo, clave, permisos } = req.body;
  permisos = Number(permisos);
  const salt = await bcrypt.genSaltSync(12);
  const passHash = await bcrypt.hashSync(clave, salt);
  knex("Usuarios")
    .max("id")
    .then(function (datos) {
      knex("Usuarios")
        .select("*")
        .where("correo", correo)
        .then(function (data) {
          console.log(data);
          if (data.length != 0) {
            res.status(400).json({ error: "Usuario ya registrado" });
          } else {
            knex("Usuarios")
              .insert({
                id: datos[0].max + 1,
                nombre: nombre,
                correo: correo,
                clave: passHash,
                permisos: permisos,
              })
              .then(function (data) {
                res.status(200).send(data);
              });
          }
        });
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
    .where(id, tipo.id)
    .then(() => {
      res.status(200).json({ error: "No errors" });
    })
    .catch((error) => {
      anyErrors = true;
      res.status(400).json({ error: error.message });
    });
};
