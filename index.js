const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const pokedex = require("./routes/pokedex");
const loginSystem = require("./routes/login")

require("dotenv").config();
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", pokedex);
app.use("/api", loginSystem)
app.use("/imagenes/", express.static('imagenes'));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`servidor corriendo en puerto ${port}`);
});
