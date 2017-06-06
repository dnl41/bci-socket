var mongoose = require("mongoose");
var Schema = mongoose.Schema;
/* 
string
data 
number 
bufer
bolean 
mixed
array
objectid
*/

mongoose.connect("mongodb://localhost/fotos");

var posibles_valores = ["M","F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"coloca un email valido"];

var user_schema = new Schema({
name: String,
username: {
	type: String, 
	required: true, 
	maxlength:[50,"menos"],
	minlength:[3,"mas"] },
password: {
	type: String, 
	minlength:[6,"La contraseña es muy corta"],
	validate:{
		validator: function(p){
			return this.password_confirmation == p;
		},
		message: "Las contraseñas no son iguales"
	}
  },

age:{type: Number, min:[5,"La edad no puede ser menor que 5"], max:[80,"La edad no puede ser mayor que 100"]},
email:{type: String,required: "El correo es obligatorio", match: email_match},
date_of_birth: Date,
sex:{type: String, enum: posibles_valores, message:"Opcion no valida"} 
});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
    this.p_c = password;
});


// modelo es como la tabla, coleccion es en proral ejemplo: Users
var User = mongoose.model("User",user_schema);
module.exports.User = User;


