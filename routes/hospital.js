
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
//var SEED = require('../config/config').SEED;

var app= express();

var Hospital= require('../models/hospital');


//===============================================
//  Obteber todos los hospitales
//===============================================




app.get('/',(req,res,next)=>{
    var desde=req.query.desde ||0;
    desde=Number(desde);
    if (desde === -1) {
 
        Hospital.find({}).populate('usuario', 'nombre img email')
            .sort('nombre')
            .exec(
                (err, hospitales) => {
 
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al cargar hospitales.',
                            errors: err
                        });
                    }
 
                    Hospital.count({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            hospitales: hospitales,
                            total: conteo
                        });
                    });
                });
 
    }else{

    Hospital.find({}).skip(desde).limit(5).populate('usuario','nombre email').exec(
        (err,hospitales)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando hospitales!',
                errors:err
            });
        }

        Hospital.count({},(err,conteo)=>{
            res.status(200).json({
                ok:true,
                hospitales: hospitales,
                total:conteo
            });
        })
       
       


    });  //Metodo de mongoose.


}
    
    
    });


// ==========================================
// Obtener Hospital por ID <- Nuevo servicio.
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
    .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            res.status(200).json({
            ok: true,
            hospital: hospital
            });
        })
    })
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
//  Actualizar hospitales
//===============================================
// Se puede utilizar put or path



app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

var id = req.params.id;
var body = req.body;

Hospital.findById(id,(err,hospital)=>{
    
    if(err){
        return res.status(500).json({
            ok:false,
            mensaje: 'Error al buscar hospitales!',
            errors:err
        });
    }

    if(!hospital){
        return res.status(400).json({
            ok:false,
            mensaje: 'El hospital con el '+id+' no existe.',
            errors:{message: 'No existe un hospital con ese ID'}
        });
    }


    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err,hospitalGuardado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al actualizar hospitales!',
                errors:err
            });
        }
        res.status(200).json({
            ok:true,
            hospital: hospitalGuardado,
            problema:req.body
        });


    });





});
  

});






//===============================================
//  Crear un nuevo hospital
//===============================================

app.post('/',mdAutenticacion.verificarToken,(req,res)=>{


    var body = req.body;

    var hospital= new Hospital({ //referencia a una variable de tipo hospital

        nombre: body.nombre,
        usuario: req.usuario._id // Tener en cuenta el _id 
    }); 

    hospital.save((err,hospitalGuardado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear hospitales!',
                errors:err
            });
        }
        res.status(201).json({
            ok:true,
            hospital: hospitalGuardado
        });


    });
    
});




//===============================================
//  Eliminar hospitales por el id.
//===============================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    var id = req.params.id; // id por el /:id.


    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar hospitales!',
                errors:err
            });
        }

        if(!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe un hospital con este id: '+id+'.',
                errors:{message: 'No existe un hospital con ese ID'}
            });
        }
        res.status(200).json({
            ok:true,
            hospital: hospitalBorrado
        });




    });


});



    module.exports= app;