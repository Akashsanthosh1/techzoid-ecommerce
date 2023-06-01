const{default:mongoose}= require("mongoose");
const db=require("../config/connection");

const orderschema=new mongoose.Schema({
    userid:{
        type:mongoose.Types.ObjectId,
    },
    deliveredto:{
       
        paymentmethod:{
            type:String,
        },
        total:{
            type:Number
        },
        date:{
            type:Date
        },
        status:{
            type:String
        },
        fname:{
            type:String
        },
        lname:{
            type:String
        },
        
        country:{
            type:String
        },
        address1:{
            type:String
        },
        address2:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        pin:{
            type:String
        },
        email:{
            type:String
        },
        phone:{
            type:String
        }
    },
    productids:[
        {
            productid:{
                type:mongoose.Types.ObjectId,
                ref:'product'
            },
            quantity:{
                type:Number,
            },
        }
    ]

});

module.exports=mongoose.model('order',orderschema);