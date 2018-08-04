

var express = require('express');

var app= express();

var Hospital=require('../models/hospital');
var Medico=require('../models/medico');
var Usuario=require('../models/usuario');


//===============================================
//  Busqueda por coleccion- metodo get
//===============================================


app.get('/coleccion/:tabla/:busqueda',(req,res,next)=>{

    var tabla = req.params.tabla;
    var busqueda= req.params.busqueda;
    var regex= new RegExp(busqueda,'i'); //Expresion regular.

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa=  buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa=  buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa=  buscarHospitales(busqueda, regex);
            break;
    
        default:
            res.status(400).json({
                ok:false,
                mensaje:'Los tipos de busqueda solo son: usuarios,medicos,hospitales',
                error:{ message: 'Tipo de tabla/coleccion no valido.'}
            });
            break;
    }

    promesa.then(data =>{

        res.status(200).json({
            ok:true,
            [tabla]:data  //Propiedad de objetos computadas.
        });

    });

    });




//===============================================
//  Busqueda general- metodo get
//===============================================
app.get('/todo/:busqueda',(req,res,next)=>{

    var busqueda= req.params.busqueda;
    var regex= new RegExp(busqueda,'i'); //Expresion regular.
//Procesos asincronos.

    Promise.all([ // Arreglo de promesa, si todas funcionan manda un then, si no un catch.
         buscarHospitales(busqueda,regex), 
         buscarMedicos(busqueda,regex),
         buscarUsuarios(busqueda, regex)]).then(respuestas =>{
            res.status(200).json({
                ok:true,
                hospitales:respuestas[0],
                medicos: respuestas[1],
                usuarios:respuestas[2]
            });

         });



    });


function buscarHospitales(busqueda, regex){

    return new Promise((resolve,reject)=>{
        Hospital.find({ nombre:regex})
        .populate('usuario','nombre email img')
        .exec((err,hospitales)=>{ //  /busqueda/i <- Expresion regular 
            if(err){
                reject('Error al cargar hospitales',err);
            }else{

                resolve(hospitales);
            }

        });


    });

    
}

//===============================================
//  Funciones de busquedas.
//===============================================

function buscarMedicos(busqueda, regex){

    return new Promise((resolve,reject)=>{
        Medico.find({ nombre:regex})
        .populate('usuario','nombre email img')
        .populate('hospital')
        .exec((err,medicos)=>{ //  /busqueda/i <- Expresion regular 
            if(err){
                reject('Error al cargar medicos',err);
            }else{

                resolve(medicos);
            }

        });


    });

    
}
function buscarUsuarios(busqueda, regex){

    return new Promise((resolve,reject)=>{
        Usuario.find({},'nombre email role img')
        .or([ {'nombre':regex}, {'email':regex}])
        .exec((err,usuarios)=>{

            if(err){

                reject('Error al cargar los usuarios',err);
            }else{
                resolve(usuarios);
            }
        });


    });

    
}



module.exports= app;