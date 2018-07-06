
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var mdAutenticacion = require('../middlewares/autenticacion');
//var SEED = require('../config/config').SEED;

var app= express();

var Usuario= require('../models/usuario');


//===============================================
//  Obteber todos los usuarios
//===============================================




app.get('/',(req,res,next)=>{


    Usuario.find({},'nombre email img role').exec(
        (err,usuarios)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando usuarios!',
                errors:err
            });
        }
        res.status(200).json({
            ok:true,
            usuarios: usuarios
        });
       


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
//  Actualizar usuarios
//===============================================
// Se puede utilizar put or path



app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

var id = req.params.id;
var body = req.body;

Usuario.findById(id,(err,usuario)=>{
    
    if(err){
        return res.status(500).json({
            ok:false,
            mensaje: 'Error al buscar usuarios!',
            errors:err
        });
    }

    if(!usuario){
        return res.status(400).json({
            ok:false,
            mensaje: 'El usuario con el '+id+' no existe.',
            errors:{message: 'No existe un usuario con ese ID'}
        });
    }


    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err,usuarioGuardado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al actualizar usuarios!',
                errors:err
            });
        }

        usuarioGuardado.password=':)';
        res.status(200).json({
            ok:true,
            usuario: usuarioGuardado
        });


    });





});
  

});






//===============================================
//  Crear un nuevo usuario
//===============================================

app.post('/',mdAutenticacion.verificarToken,(req,res)=>{


    var body = req.body;

    var usuario= new Usuario({ //referencia a una variable de tipo usuario

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    }); 

    usuario.save((err,usuarioGuardado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear usuarios!',
                errors:err
            });
        }
        res.status(201).json({
            ok:true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });


    });
    
});




//===============================================
//  Eliminar usuarios por el id.
//===============================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    var id = req.params.id; // id por el /:id.


    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar usuarios!',
                errors:err
            });
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe un usuario con este id: '+id+'.',
                errors:{message: 'No existe un usuario con ese ID'}
            });
        }
        res.status(200).json({
            ok:true,
            usuario: usuarioBorrado
        });




    });


});



    module.exports= app;