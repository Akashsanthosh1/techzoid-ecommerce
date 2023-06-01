const {default:mongoose}=require("mongoose");
const db = require('../config/connection');
var addressschema=new mongoose.Schema({

      couponid:{
        type:String,
        required:true
      },
      expirydate:{
        type:Date,
        required:true
      },
      percentageoffer:{
        type:Number,
        required:true
      },
      maxoffer:{
        type:Number,
        required:true
      }
      

})

module.exports=mongoose.model("coupon",addressschema)