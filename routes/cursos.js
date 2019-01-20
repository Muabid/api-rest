var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { checkSchema, validationResult } = require('express-validator/check');
const mongoose= require('mongoose');
const Curso = require("../model/Curso");

var path = require('path');
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {

    console.log("HOLA");
    //{name:{"$split":1}}
    Curso.find(req.query).limit(10).then(function (cursos) {

        res.json(cursos);

    }).catch((err) => {
        console.error(err);
        res.status(500);
        res.send();
    });

});

router.post('/',bodyParser.json(),checkSchema({

    anio: {
        in: ['body'],
        errorMessage: '',
        isInt:true,
        toInt:true
    },
    duracion: {
        in: ['body'],
        errorMessage: '',
        isInt: true,
        toInt: true
    },
    tema: {
        in: ['body'],
        errorMessage: '',
        isString: true
    },
    alumnos:{
        in:['body'],
        errorMessage:'',
        isArray:true
    }

}),function(req,res){
    let validation=validationResult(req).array();
    if(validation.length>0){
        res.status(400).json(validation);
        return;
    }

    var curso =new Curso({
        anio:req.body.anio,
        duracion: req.body.duracion,
        tema: req.body.tema,
        alumnos: req.body.alumnos
    });

    curso.save().then(doc => {
        res.status(201).json(doc);
    }).catch((err) => {
        console.error(err),
        res.status(500).send()
    });
});

router.get('/:_id/alumnoDestacado',function (req,res) {
    let id=req.params._id;
    Curso.aggregate([
        {$match:{_id:mongoose.Types.ObjectId(id)}},
        {$unwind:"$alumnos"},
        {$project:{_id:0,alumnos:1}},
        {$sort:{"alumnos.nota":-1}},
        {$limit:1}
    ]).then(function (curso){
        res.json(curso[0].alumnos);
        console.log(curso[0].alumnos);
    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
});

router.get('/:_id/alumnos',function (req,res) {
    let id=req.params._id;
    Curso.findOne({_id:req.params._id}, 'alumnos -_id')
    .then(function (query){
        res.json(query.alumnos);
        console.log(query.alumnos);
    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
});

router.delete('/:_id',function (req,res) {
    Curso.findOneAndRemove({_id:req.params._id}).then(function (curso) {
        if(curso==null){
            res.stat(400);
            return;
        }
        else{
            res.json(curso);
        }
    }).catch( (err) => {
        console.error(err);
        res.stat(500).send();
    })
})

module.exports = router;