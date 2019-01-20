const mongoose = require("mongoose");
const Cliente = require("./Cliente.js").schema;


const Curso = new mongoose.Schema({
    anio:Number,
    duracion:Number,
    tema:{ type:String, trim:true }  ,
    alumnos:{type:[Cliente], default:[]}
});

module.exports = mongoose.model("Curso", Curso);