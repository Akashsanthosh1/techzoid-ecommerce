var db = require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const userModel = require("../models/user-models")
const cartmodel=require("../models/cart-schema")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const productSchema=require("../models/product-schema");

const cartSchema = require('../models/cart-schema')
const addressSchema = require('../models/address-schema')
const { address } = require('../controller/userController')
const couponSchema = require('../models/coupon-schema')
const orderschema=require('../models/order-schema')
require('dotenv').config()
//otpverify
const accountSid = process.env.twilio_accountSid;
const authToken = process.env.twilio_authToken;
const client = require('twilio')(accountSid, authToken);
//razorpay
const Razorpay = require('razorpay')
var instance = new Razorpay({
  key_id: process.env.razorpay_key_id,
  key_secret: process.env.razorpay_key_secret,
});




module.exports = {
  signup: (UserData) => {
    return new Promise(async (resolve, reject) => {
      UserData.password = await bcrypt.hash(UserData.password, 10)
      var userDetails = new userModel({
        email: UserData.email,
        password: UserData.password

      })
      userDetails.save();
      console.log('new user added');
    })
  },


  userlogin: (UserData) => {
    let response = {}

    return new Promise(async (resolve, reject) => {
      let user = await userModel.findOne({ email: UserData.email })
      console.log('userdata', UserData);
      console.log('useR', user);
      if (user) {

        bcrypt.compare(UserData.password, user.password).then((status) => {
 
          if (status) {
            console.log('user found');
            response.user = user
            response.status = true
            resolve(response)
          }


        })
      }
    })

  },


  Verifyemail: (userdata) => {
    return new Promise((resolve, reject) => {


      const name = userdata.name
      const email = userdata.email
      const password = userdata.password
      const mobile = userdata.number

      const user = { id: Math.floor(Math.random() * 9000 + Date.now()) };
      const secret = "mysecreatkey";
      const token = jwt.sign(user, secret, { expiresIn: "1h" });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,

        auth: {
          user: "jacksparroww369@gmail.com",
          pass: "jubgqdiejfajzcdq",
        },
      });

      const mailOptions = {
        from: "jacksparroww369@gmail.com",
        to: userdata.email,
        subject: "Verify your email address",
        text: `Please click on the following link to verify your email address:http://localhost:3000/verify?token=${token}&name=${name}&email=${email}&password=${password}&mobile=${mobile}`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
        resolve()
      })
    });






  },
  Getcartproducts:(userid)=>{
    console.log('userid',userid);
    return new Promise(async(resolve, reject) => {
      cartmodel.findOne({userid:userid})
      .populate("cartproductids.productid")
      .then((data)=>{
        console.log('cartproductids',data);
        resolve(data.cartproductids)
      })
    })
  },



  otprequest: async (data) => {
    
    return new Promise(async(resolve, reject) => {
      
      var user = await userModel.findOne({ mobile: data.mobile })
    if (user && user.status) {
      console.log("userrr", user);
      global.user=user;

      const otp = Math.floor(1000 + Math.random() * 9000);
      global.OTP = otp
      console.log('otp saved', global.OTP);
      const message = `Your OTP code is ${otp}.`;
      const phoneNumber = `+${user.mobile}`; // replace with the user's phone number

      client.messages
        .create({
          body: message,
          from: '+1 434 686 7646', // replace with your Twilio phone number
          to: phoneNumber
        })
        .then(message =>
          console.log(`OTP sent to ${phoneNumber}`

          ))
        .catch(error => console.log(`Error sending OTP: ${error.message}`));







    }else{
      resolve()
    }
    
    })
  },


  OTPsend: (data) => {
    console.log(data, 'data');
    return new Promise((resolve, reject) => {
      const otp = parseInt(data.otp);
      const storedotp = global.OTP 
     const  otpuser=global.user;
     console.log('otpuser',otpuser);
      console.log("otp========", otp);
      console.log("storedotp========", storedotp);
      if (storedotp === otp ) {
        resolve(otpuser);
      } else{
        reject()
      }
    });
  },
  getproducts:()=>{
    return new Promise(async(resolve, reject) => {
     
      
      const products=await productSchema.find()
      
    
      
        resolve(products)
    })
  },
  getcartcount:(userid)=>{
    return new Promise(async(resolve, reject) => {
      let count =0
      const cart=await cartSchema.findOne({userid:userid})
      count=cart.cartproductids.length
      console.log('caart count',count);
      resolve(count)
    })

  },
  
  Addtocart:(id,userid)=>{
    return  new Promise(async(resolve, reject) => {
      let product={
        productid:id,
        quantity:1,
      };
        let usercartexist=await cartmodel.findOne({userid:userid});
        if(usercartexist){
            let idexist=usercartexist.cartproductids
            let index=idexist.findIndex(product=>product.productid==id)   
           
            
            if(index!=-1){

              await cartmodel.updateOne(
                {"cartproductids.productid":id,userid:userid},
                {$inc:{"cartproductids.$.quantity":1}}
              )
              resolve();
            }
           
          else{
            await cartmodel.updateOne(
              {userid:userid},

              {$push:{cartproductids:product}}
            )
            resolve();
          }
        }
        else{
          let cartModel=new  cartmodel({
            userid:userid,
            cartproductids:product,
            
          })
          cartModel.save();
          resolve();
        }
        }
       
      
    )
   

  },
  Changeproductquantity:(details,userid)=>{
    let count=parseInt(details.count)
    let quantity=parseInt(details.quantity)
    let productid=details.productid
    return new Promise(async(resolve, reject) => {
        if(count==-1 && quantity==1){
           await cartmodel
            .updateOne({userid:userid},
            {
                $pull:{cartproductids:{productid:productid}}
            }
            )
                resolve({removeProduct:true})
            
        }else{
          let total=0
           await cartmodel.updateOne({"cartproductids.productid":productid},
            {
            $inc:{"cartproductids.$.quantity":count}
            }



            );
            let product=await cartmodel
            .findOne({userid:userid})
            .populate("cartproductids.productid");

            if(product){
              let proddetails=product.cartproductids
              for(const product of proddetails ){
                total += product.productid.price*product.quantity
              }
            }
          global.total=total;
            resolve({addcount:true,total})
            
            
        }
    })
  },
  Removeproduct:(id,userid)=>{
    return new Promise(async(resolve, reject) => {
      await cartmodel
      .updateOne({userid:userid,'cartproductids.productid':id},
      {
          $pull:{cartproductids:{productid:id}}
      }
      )

      resolve()
    })
  },
  getproductdetails:(id)=>{
    return new Promise(async(resolve, reject) => {

      const product=await productSchema.findOne({_id:id})

      resolve(product)

    })
  },
  saveaddress:(data)=>{
return new Promise(async(resolve, reject) => {
  const address=await new addressSchema({
    name:data.name,
    country:data.country,
    address:data.address,
    phone:data.phone,
    email:data.email,
  })
 address.save()
  resolve(response)
})
  },
  getaddress:()=>{
    return new Promise(async(resolve, reject) => {
     let ab={}
        ab.address=await addressSchema.find()
      ab.defaultaddress=await addressSchema.findOne({status:true})
      console.log(ab.address,ab.defaultaddress,'ad');
     const total=global.total
     console.log('retirn total',total);
      resolve(ab)
    })
  },
  Getaddress:(id)=>{
    return new Promise(async(resolve, reject) => {
      console.log('get id',id);
     await addressSchema.updateMany(
        {status:false}
      )
      await addressSchema.findByIdAndUpdate(id,
        {
          status:true
        })
        const address=await addressSchema.findById(id)
        if(address.status==true){
          
          resolve(address)
        }
      

      
    })
  },
  couponapply:(id,total)=>{
    return new Promise(async(resolve, reject) => {
      console.log('rerere',id);
      let coupon=await couponSchema.findOne({couponid:id})
      let date=new Date()
      if(coupon){
        console.log('date',date,'cooupondate',coupon.expirydate);
        if(coupon.expirydate>date&&total>5000){
          console.log('coupon applied');
          let offer=total-(coupon.maxoffer)
          
          resolve(offer)

        }else{
          console.log('coupon expired');
        }
      }else{
        console.log('invalid coupon');
      }


    })
  },
  saveorder:(data,userid)=>{
    return new Promise(async(resolve, reject) => {
      let productids=await cartSchema.findOne({userid:userid})
      let cartproductids=productids.cartproductids
      let date=new Date()
      const neworder= await new orderschema({
        userid:userid,
        deliveredto:{
          
        fname:data.fname,
        lname:data.lname,
        date:date,
        country:data.country,
        address1:data.address1,
        address2:data.address2,
        phone:data.phone,
        email:data.email,
        total:data.total,
        pin:data.pin,
        city:data.city,
        state:data.state,
        paymentmethod:data.paymentmethod,
        status:'placed'
        },
        productids:cartproductids,
        
      })
      neworder.save()
      
      resolve(neworder)
    })
  },
  listorder:()=>{
    return new Promise(async(resolve, reject) => {
      let orders=await orderschema.find()
      console.log('ordersss',orders);
      resolve(orders)
    })
  },
  allproducts:()=>{
    return new Promise(async(resolve, reject) => {
      let product=await productSchema.find()
      resolve(product)
    })
  },
  razorpay:(data)=>{
    return new Promise((resolve, reject) => {
      console.log('data',data);
    var options = {
      amount: data.deliveredto.total*100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: data._id + "",
    };
    instance.orders.create(options, function(err, order) {
      
      console.log(order);
    resolve(order)
    });
  
    })


  },
  VerifyPayment: (detail) => {
    return new Promise((resolve, reject) => {
      console.log("cryyyyyyyyyyyypto ", detail);
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "1oX2pJ43Q3WTkUf5wo9PxjoB");
      hmac.update(
        detail.response.razorpay_order_id +
          "|" +
          detail.response.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      if (hmac == detail.response.razorpay_signature) {
        resolve();
      } else {
        reject();
   }
});
},
orderreturn:(id)=>{
return new Promise(async(resolve, reject) => {
  await orderschema.findByIdAndUpdate(id,{'deliveredto.status':'returned'})
  resolve()
})
},
ordercancel:(id)=>{
  return new Promise(async(resolve, reject) => {
    await orderschema.findByIdAndUpdate(id,{'deliveredto.status':'cancelled'})
    resolve()
  })
}
  

  


}





