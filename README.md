# senpaiProyectoFinal

# IMPORTANTE, CREAR UN ARCHIVO directorio.js EN LA CARPETA Utilities
# El archivo debera contener 

# exports.directorio = () => {
#    return <DONDE_ESTA_LA_CARPETA_DEL_BACKEND_AQUI>
# }
# e.g. "C:/Users/Pablo/Desktop/SAP/Proyecto Final/SenpaiProyectoFinalBackend"


# POST /api/login Toma por body un JSON por body con correo, clave y devuelve un JWT si existen en la base de datos, el correo tiene que ser un correo valido
# POST /api/register Toma por body un JSON por body con correo, clave, nombre, permisos, si el correo no existe lo registra en la base de datos, el correo tiene que ser un correo valido
# Permisos por default es 1 y un usuario con permisos 1 es administrador
# Cambiar la funcion validator isAdmin si se desea un numero distinto
# Cambiar la funcion validator permisosValido si se desea permitir/restringir los numeros validos
# GET /api/pokedex devuelve una lista de JSON que contienen todos los datos de los pokemones
# POST /api/pokemon/nuevo require un formData que contiene un atributo 'Imagen' que es una imagen .jpg o .png y un atributo Pokemon que es un pokemon valido
# PUT /api/pokemon/editar require un formData que contiene un atributo 'Imagen' que es una imagen .jpg o .png y un atributo Pokemon que es un pokemon valido, ademas el pokemon debera contener un atributo extra llamado idViejo que es un id valido
# GET /api/pokedex/:id devuelve un JSON con los datos del pokemon cuyo id es id
# DELETE /api/pokemon/:id borra el pokemon cuyo id es :id de la base de datos

# Solo los usuarios administradores pueden agregar, editar o borrar pokemones o tipos de la base de datos


# id valido es un numero entero positivo
# Tipo valido se refiere a uno de los 18 tipos validos de pokemon, en ingles, con mayuscula en la primer letra
# 1 - Normal
# 2 - Rock
# 3 - Ghost
# 4 - Steel
# 5 - Water
# 6 - Fighting
# 7 - Flying
# 8 - Poison
# 9 - Fairy
# 10- Dragon
# 11- Dark
# 12- Electric
# 13- Grass
# 14- Fire
# 15- Ice 
# 16- Psychic
# 17- Bug
# 18- Ground
# 19- Typeless, no es valido para agregarlos pero la base de datos puede regresarlo si hay algun error

# Pokemon valido
# {
#      id: id,
#      nombre: nombre,
#      foto: foto,
#      tipo1: tipo1,
#      tipo2: tipo2,
#      weight: weight,
#      height: height,
#      abilities: abilities,
#      stats: {
#       hp: hp,
#        atk: atk,
#        def: def,
#        satk: satk,
#        sdef: sdef,
#        spd: spd,
#      },
#      descripcion: descripcion
#    }

# weight valido es /^[0-9]+[,]+[0-9]+[k]+[g]$/g pero al devolverse es un float
# height valido es /^[0-9]+[,]+[0-9]+[m]$/g pero al devolverse es un float
# foto es la url de la imagen del pokemon en el backend


# Existe una carpeta SQL la cual contiene los scripts para general la base de datos
# La base de datos a utilizar debe ser postgres
# La base de datos debe llamarse proyecto-final, usar el puerto 5432, el usuario por defecto es postgres, pw postgres
# En la carpeta config existe el archivo knex en caso de que se quiera modificar

