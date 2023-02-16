const knex = require("../knexfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";

exports.mostrarPokemones = (req, res) => {
  knex("Pokemones")
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.buscarPokemon = (req, res) => {
  const id = Number(req.params.id);
  knex("Pokemones")
    .where("id", id)
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  knex("usuarios")
    .select("*")
    .where("correo", username)
    .then(function (data) {
      if (data.length != 1) {
        res.status(400).json("Usuario o contrasena incorrectos");
      }
      const user = data[0];
      const validPassword = bcrypt.compareSync(password, user.password);
      if (validPassword) {
        const token = jwt.sign(
          {
            username: user.username,
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

exports.register = (req, res) => {
  let { username, password, permisos } = req.body;
  permisos = Number(permisos);
  const salt = bcrypt.genSaltSync(12);
  const passHash = bcrypt.hashSync(password, salt);
  knex("usuarios")
    .select("*")
    .where("correo", username)
    .then(function (data) {
      if (data.length != 0) {
        res.status(400).json({ error: "Usuario ya registrado" });
      } else {
        knex("usuarios")
          .insert({
            username: username,
            password: passHash,
            permisos: permisos,
          })
          .then(function (data) {
            res.status(200).send(data);
          });
      }
    });
};

exports.addPokemon = (req, res) => {
  const { tipo_id, nombre, foto, peso, altura, habilidad, descripcion } =
    req.body;
  knex("Pokemones")
    .insert({
      tipo_id: tipo_id,
      nombre: nombre,
      foto: foto,
      peso: peso,
      altura: altura,
      habilidad: habilidad,
      descripcion: descripcion,
    })
    .then(() => {
      knex("Pokemones")
        .select()
        .then((pokemones) => {
          res.status(200).json({ message: `Se agrego el pokemon ${nombre}` });
        });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.deletePokemon = (req, res) => {
  const id = req.params.id;
  knex("Pokemones")
    .where("id", id)
    .del()
    .then(() => {
      knex("Pokemones")
        .select()
        .then((pokemones) => {
          res
            .status(200)
            .json({ message: `Se elimino el pokemon ${id}`, pokemones });
        });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
