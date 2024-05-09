const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const agregarRoommate = require("./funciones/getUser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("index.html", "utf8", (err, html) => {
    res.end(html);
  });
});

app.get("/roommates", (req, res) => {
  let roommatesJSON = JSON.parse(
    fs.readFileSync("./archivos/roommates.json", "utf8")
  );
  res.json(roommatesJSON);
});

app.post("/roommate", (req, res) => {
  agregarRoommate().then((datos) => {
    let nombre = datos.results[0].name.first;
    let apellido = datos.results[0].name.last;

    const roommate = {
      id: uuidv4(),
      nombre: nombre + " " + apellido,
      debe: "",
      recibe: "",
    };

    let roommatesJSON = JSON.parse(
      fs.readFileSync("./archivos/roommates.json", "utf8")
    );
    roommatesJSON.roommates.push(roommate);

    fs.writeFileSync(
      "./archivos/roommates.json",
      JSON.stringify(roommatesJSON, null, 1)
    );
    res.end();
  });
});

app.get("/gastos", (req, res) => {
  let gastosJSON = JSON.parse(
    fs.readFileSync("./archivos/gastos.json", "utf8")
  );
  res.json(gastosJSON);
});

app.post("/gasto", (req, res) => {
  let gastosJSON = JSON.parse(
    fs.readFileSync("./archivos/gastos.json", "utf8")
  );
  let gastos = gastosJSON.gastos;

  console.log(req.body);

  let gasto = {
    id: uuidv4(),
    roommate: req.body.roommate,
    descripcion: req.body.descripcion,
    monto: req.body.monto,
  };

  gastos.push(gasto);

  fs.writeFileSync(
    "./archivos/gastos.json",
    JSON.stringify(gastosJSON, null, 1)
  );
  res.end();
  console.log("Gasto registrado con éxito en el archivo gastos.json");
});

app.put("/gasto", (req, res) => {
  let gastosJSON = JSON.parse(
    fs.readFileSync("./archivos/gastos.json", "utf8")
  );
  let gastos = gastosJSON.gastos;

  const id = req.query.id;

  let body = req.body;
  body.id = id;

  gastosJSON.gastos = gastos.map((g) => {
    if (g.id == body.id) {
      return body;
    }
    return g;
  });

  fs.writeFileSync(
    "./archivos/gastos.json",
    JSON.stringify(gastosJSON, null, 1)
  );
  res.end();
});

app.delete("/gasto", (req, res) => {
  let gastosJSON = JSON.parse(
    fs.readFileSync("./archivos/gastos.json", "utf8")
  );
  let gastos = gastosJSON.gastos;

  const id = req.query.id;

  gastosJSON.gastos = gastos.filter((g) => g.id !== id);

  fs.writeFileSync(
    "./archivos/gastos.json",
    JSON.stringify(gastosJSON, null, 1)
  );
  res.end();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
