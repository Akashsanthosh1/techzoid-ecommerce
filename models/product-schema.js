const {default:mongoose}=require("mongoose");
const db = require('../config/connection');
var productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true

    },
    description:{
        type:String,
        required:true,
        unique:true
    },
    
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        
    }

})



module.exports=mongoose.model('product',productSchema);
