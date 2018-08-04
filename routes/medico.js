
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
//var SEED = require('../config/config').SEED;

var app= express();

var Medico= require('../models/medico');


//===============================================
//  Obteber todos los medicos
//===============================================




app.get('/',(req,res,next)=>{

    var desde=req.query.desde ||0;
    desde=Number(desde);

    Medico.find({}).skip(desde).limit(5).populate('usuario','nombre email').populate('hospital').exec(
        (err,medicos)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando medicos!',
                errors:err
            });
        }
        Medico.count({},(err,conteo)=>{
            res.status(200).json({
                ok:true,
                medicos: medicos,
                total:conteo
            });
        })
       
       


    });  //Metodo de mongoose.


  
    
    
    });




//===============================================
//  Verificar token
//===============================================

/*
app.use('/',(req,res,next)=>{

    var token= req.query.token;

    jwt.verify(token,SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                mensaje: 'Token no valido',
                errors:err
            });
        }

        next();

    });
}); // No es muy flexible este tipo de validaciones.*/

//===============================================
//  Obtener medico
//===============================================

app.get('/:id',(req,res)=>{

    var id = req.params.id;
    Medico.findById(id)
            .populate('usuario','nombre email img')
            .populate('hospital')
            .exec((err,medico)=>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error al buscar medicos!',
                        errors:err
                    });
                }
            
                if(!medico){
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'El medico con el '+id+' no existe.',
                        errors:{message: 'No existe un medico con ese ID'}
                    });
                }
                res.status(200).json({
                    ok:true,
                    medico: medico
                });


            });

});




//===============================================
//  Actualizar medicos
//===============================================
// Se puede utilizar put or path



app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

var id = req.params.id;
var body = req.body;

Medico.findById(id,(err,medico)=>{
    
    if(err){
        return res.status(500).json({
            ok:false,
            mensaje: 'Error al buscar medicos!',
            errors:err
        });
    }

    if(!medico){
        return res.status(400).json({
            ok:false,
            mensaje: 'El medico con el '+id+' no existe.',
            errors:{message: 'No existe un medico con ese ID'}
        });
    }


    medico.nombre = body.nombre;
    medico.hospital= body.hospital;
    medico.usuario = req.usuario._id;

    medico.save((err,medicoGuardado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al actualizar medicos!',
                errors:err
            });
        }
        res.status(200).json({
            ok:true,
            medico: medicoGuardado
        });


    });





});
  

});






//===============================================
//  Crear un nuevo medico
//===============================================

app.post('/',mdAutenticacion.verificarToken,(req,res)=>{


    var body = req.body;

    var medico= new Medico({ //referencia a una variable de tipo medico

        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id
    }); 

    medico.save((err,medicoGuardado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear medicos!',
                errors:err
            });
        }
        res.status(201).json({
            ok:true,
            medico: medicoGuardado
        });


    });
    
});




//===============================================
//  Eliminar medicos por el id.
//===============================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    var id = req.params.id; // id por el /:id.


    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar medicos!',
                errors:err
            });
        }

        if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe un medico con este id: '+id+'.',
                errors:{message: 'No existe un medico con ese ID'}
            });
        }
        res.status(200).json({
            ok:true,
            medico: medicoBorrado
        });




    });


});



    module.exports= app;