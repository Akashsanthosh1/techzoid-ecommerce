const {default:mongoose}=require("mongoose");
const db = require('../config/connection');
var addressschema=new mongoose.Schema({

      name:{
        type:Array,
        required:true
      },
      country:{
        type:String,
        required:true
      },
      address:{
        type:Array,
        required:true
      },
      phone:{
        type:Number,
        required:true
      },
      email:{
        type:String,
        required:true
      },
      status:{
        type:Boolean,
        default:true
      }

})

module.exports=mongoose.model("address",addressschema)