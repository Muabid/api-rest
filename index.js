const mongoose = require("mongoose");
const express = require('express');
var CursosRouter = require('./routes/cursos.js');
//var ClientesRouter = require('./routes/clientes.js');
const app = express();
const port = 9000;

app.use('/api/cursos', CursosRouter);
//app.use('/api/clientes', ClientesRouter);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/cursos');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    app.listen(port, () => console.log(`Corriendo en ${port}!`));
});

