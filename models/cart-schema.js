const {default:mongoose}=require("mongoose");
const db = require('../config/connection');
var cartschema=new mongoose.Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    cartproductids:[
        {
            productid:{
                type:mongoose.Types.ObjectId,
                ref:'product'
            },
            quantity:{
                type:Number,
            }

        }
    ],

})

module.exports=mongoose.model("cart",cartschema)