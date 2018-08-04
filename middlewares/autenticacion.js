var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;






//===============================================
//  Verificar token
//===============================================


exports.verificarToken = function (req,res,next) {
    var token= req.query.token;

    jwt.verify(token,SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                mensaje: 'Token no valido',
                errors:err
            });
        }


        req.usuario=decoded.usuario;
        
        next();

    });
}



//===============================================
//  Verificar ADMIN
//===============================================


exports.verificaraADMIN_ROLE = function (req,res,next) {
    

    var usuario = req.usuario;
    if (usuario.role==='ADMIN_ROLE') {
        next();
        return;
    }else{

        return res.status(401).json({
            ok:false,
            mensaje: 'Token no valido',
            errors:{message: 'No puede hacer eso..'}
        });

    }

}




//===============================================
//  Verificar ADMIN o mismo usuario
//===============================================


exports.verificaraADMIN_ROLE_o_MismoUsuario = function (req,res,next) {
    

    var usuario = req.usuario;
    var id = req.params.id;
    
    if (usuario.role==='ADMIN_ROLE' || usuario._id===id) {
        next();
        return;
    }else{

        return res.status(401).json({
            ok:false,
            mensaje: 'Token no valido',
            errors:{message: 'No puede hacer eso..'}
        });

    }

}

