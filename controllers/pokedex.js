const knex = require("../knexfile");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
SECRET_KEY="IENB(#HYie-igh*)Ihtgq10b";


exports.login = (req,res) => {
    const {username, password} = req.body;
    knex("users").select("*").where("username", username).then(
        function(data){
            if(data.length != 1) {
                res.status(400).json("Usuario o contrasena incorrectos")
            }
            const user = data[0]
            const validPassword = bcrypt.compareSync(password, user.password)
            if (validPassword){
                const token = jwt.sign({
                username: user.username,permisos: user.permisos, date: Date.now()}, SECRET_KEY);
                res.status(200).json({error: null, data:'Login exitoso', token})
            }
            else { return res.status(400).json({error: "Usuario o contrasena incorrectos"})}
        }
    )
  }
  exports.register = (req,res) => {
      let {username, password, permisos} = req.body
      permisos = Number(permisos)
      const salt = bcrypt.genSaltSync(12)
      const passHash = bcrypt.hashSync(password, salt)
      knex("ususuarios").select("*").where("correo", username).then(
          function(data){
              if (data.length != 0){
                  res.status(400).json({error:"Usuario ya registrado"})
              }
              else {
                  knex("users").insert({username: username, password: passHash, permisos: permisos})
              .then(function(data){
              res.status(200).send(data)
          })
              }
          }
      )
  }