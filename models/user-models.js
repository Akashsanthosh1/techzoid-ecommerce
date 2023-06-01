const {default:mongoose}=require("mongoose");
const db = require('../config/connection');
var userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true

    }

})



module.exports=mongoose.model('user',userSchema);
