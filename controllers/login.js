const knex = require("../knexfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";

exports.register = async (req, res) => {
  let { nombre, correo, clave, permisos } = req.body;
  permisos = Number(permisos);
  //Cambio el password por un hash de Bcrypt
  const salt = bcrypt.genSaltSync(12);
  const passHash = bcrypt.hashSync(clave, salt);
  //Tomo el usuario con el id mas grande, agrego el usuario nuevo con el id mas grande +1.
  knex("Usuarios")
    .max("id")
    .then(function (datos) {
      //Si existe el correo que no lo registre.
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

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  console.log(req.body);
  await knex("Usuarios")
    .select("*")
    .where("correo", correo)
    .then(function (data) {
      //Si no encuentra el correo regresa error
      if (data.length != 1) {
        res.status(400).json("Usuario o contrasena incorrectos");
      }
      const user = data[0];
      const validPassword = bcrypt.compareSync(clave, user.clave);
      //Si el hash se pudo generar con esa contrasenia loguea
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


//
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
