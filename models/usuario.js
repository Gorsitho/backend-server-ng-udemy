

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   


var Schema= mongoose.Schema;


var roleValidos={

    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} NO ES UN ROL PERMITIDO'

};

var usuarioSchema = new Schema({  //Esquema con validaciones.

    nombre:{ type:String, required:[true, 'El nombre es necesario']},
    email:{ type:String,unique:true, required:[true, 'El correo es necesario']},
    password:{ type:String, required:[true, 'La contraseña es necesario']},
    img:{ type:String, required:false},
    role:{ type:String, required:true,default:'USER_ROLE', enum: roleValidos},
    google:{ type:Boolean,default:false}
});

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico'});


module.exports = mongoose.model('Usuario',usuarioSchema);