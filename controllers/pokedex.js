const knex = require("../knexfile");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
SECRET_KEY="IENB(#HYie-igh*)Ihtgq10b";


exports.login = (req,res) => {
    const {correo, password} = req.body;
    knex("Usuarios").select("*").where("correo", correo).then(
        function(data){
            if(data.length != 1) {
                res.status(400).json("Usuario o contrasena incorrectos")
            }
            const user = data[0]
            const validPassword = bcrypt.compareSync(password, user.password)
            if (validPassword){
                const token = jwt.sign({
                correo: user.correo,permisos: user.permisos, date: Date.now()}, SECRET_KEY);
                res.status(200).json({error: null, data:'Login exitoso', token})
            }
            else { return res.status(400).json({error: "Usuario o contrasena incorrectos"})}
        }
    )
  }
  exports.register = (req,res) => {
    console.log(req.body)
    let id = 0;
    let {correo, password, permisos, nombre} = req.body
      permisos = Number(permisos)
      const salt = bcrypt.genSaltSync(12)
      const passHash = bcrypt.hashSync(password, salt)
    knex("Usuarios").max("id").then(
        function(data){
            id = data[0].max+1 || 1
            knex("Usuarios").select("*").where("correo", correo).then(
                function(data){
                    if (data.length != 0){
                        res.status(400).json({error:"Usuario ya registrado"})
                    }
                    else {
                        knex("Usuarios").insert({id: id,nombre: nombre, correo: correo, clave: passHash, permisos: permisos})
                    .then(function(data){
                    res.status(200).send(data)
                })
                    }
                }
            )
        }
    )
      
        
      
  }