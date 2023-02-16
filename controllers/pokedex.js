const knex = require("../knexfile");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
SECRET_KEY = "IENB(#HYie-igh*)Ihtgq10b";

exports.mostrarPokemones = async (req, res) => {
    await knex("Pokemones")
        .join('tipos', 'pokemones.tipo_id', '=', 'tipos.id')
        .join('estadisticas', 'pokemones.id', '=', 'estadisticas.id')
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

exports.addPokemon = async (req, res) => {
    const pokemon = req.body
    await knex("Pokemones")
        .insert({
            tipo_id: pokemon.id,
            nombre: pokemon.nombre,
            peso: pokemon.peso,
            altura: pokemon.altura,
            habilidad: pokemon.habilidad,
            descripcion: pokemon.descripcion
        })
        .then(() => {
            res.status(200).json({ error: null, data: "Se agrego correctamente", pokemon })
        })
        .catch((error) => {
            res.status(400).json({ error: error.message })
        })
}

exports.addTipoPokemon = async (req, res) => {
    const tipo = req.body
    await knex("Tipos")
        .insert({
            id: tipo.id,
            nombre: tipo.nombre
        })
        .then(() => {
            res.status(200).json({ error: null, data: "Se agrego correctamente", tipo })
        })
        .catch((error) => {
            res.status(400).json({ error: error.message })
        })
}

exports.addEstadisticaPokemon = async (req, res) => {
    const estadistica = req.body
    await knex("Estadisticas")
        .insert({
            id: estadistica.id,
            hp: estadistica.hp,
            atk: estadistica.atk,
            def: estadistica.def,
            satk: estadistica.satk,
            sdef: estadistica.sdef,
            spd: estadistica.spd
        })
        .then(() => {
            res.status(200).json({ error: null, data: "Se agrego correctamente", estadistica })
        })
        .catch((error) => {
            res.status(400).json({ error: error.message })
        })
}

exports.deletePokemon = async (req, res) => {
    await knex("Pokemones")
        .where("id", Number(req.params.id))
        .del()
        .then(() => {
            res.status(200).json({ message: "borrado correctamente" })
        })
        .catch((error) => {
            res.status(400).json({ error: error.message })
        })
}

exports.updatePokemon = async (req, res) => {
    const pokemon = req.body
    await knex("Pokemones")
        .where("id", req.params.id)
        .update({
            tipo_id: pokemon.id,
            nombre: pokemon.nombre,
            peso: pokemon.peso,
            altura: pokemon.altura,
            habilidad: pokemon.habilidad,
            descripcion: pokemon.descripcion
        }
        )
        .then(() => {
            res.status(200).json({ message: "modificado correctamente" })
        })
        .catch((error) => {
            res.status(400).json({ error: error.message })
        })
}


exports.login = async (req, res) => {
    const { correo, password } = req.body;
    await knex("Usuarios").select("*").where("correo", correo).then(
        function (data) {
            if (data.length != 1) {
                res.status(400).json("Usuario o contrasena incorrectos")
            }
            const user = data[0]
            const validPassword = bcrypt.compareSync(password, user.clave)
            if (validPassword) {
                const token = jwt.sign({
                    correo: user.correo, nombre: user.nombre, permisos: user.permisos, date: Date.now()
                }, SECRET_KEY);
                res.status(200).json({ error: null, data: 'Login exitoso', token })
            }
            else { return res.status(400).json({ error: "Usuario o contrasena incorrectos" }) }
        }
    )
}

exports.logout = (req, res) => {
    if (req.session) {
        req.session.delete(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logout successful')
            }
        });
    } else {
        res.end()
    }
}

exports.register = async (req, res) => {
    let { nombre, correo, clave, permisos } = req.body
    permisos = Number(permisos)
    const salt = await bcrypt.genSaltSync(12)
    const passHash = await bcrypt.hashSync(clave, salt)
    await knex("Usuarios").select("*").where("correo", correo).then(
        function (data) {
            if (data.length != 0) {
                res.status(400).json({ error: "Usuario ya registrado" })
            }
            else {
                knex("Usuarios").insert({ nombre: nombre, correo: correo, clave: passHash, permisos: permisos })
                    .then(function (data) {
                        res.status(200).send(data)
                    })
            }
        }
    )
}