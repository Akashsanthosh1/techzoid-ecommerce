const { response } = require("../app");
var {signup,userlogin,Verifyemail,
    Getcartproducts,otprequest,
    OTPsend,getproducts,Addtocart,  
    Changeproductquantity,Removeproduct,
    getproductdetails, getcartcount,saveaddress,getaddress,
    Getaddress,couponapply,saveorder,listorder,allproducts,razorpay,VerifyPayment,orderreturn,ordercancel}=require('../helpers/user-helpers')
var db=require('../config/connection')
var userModel=require('../models/user-models')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const verifyLogin =(req,res,next)=>{

    if(req.session.loggedIn){
        next()
    }else
    {
        res.redirect('/')
    }
}

module.exports={
    index: async function(req,res,next){
        
        const user=req.session.user;
        console.log('session user',user); 
        if(user){
            const userid=req.session.user._id
            console.log('userid',userid);
          const cartCount= await getcartcount(userid)
       
          getproducts().then((data)=>{
            console.log('indexdataa',data);
           console.log(cartCount,'lkl');
           
            res.render('user/index',{user,data,cartCount});
           
        })
          
        }else{
            getproducts().then((data)=>{
                console.log('indexdataa',data);
               
               
                res.render('user/index',{user,data});
               
    
            })

        }
        
    },

    verifyemail:
    (req,res)=>{
        Verifyemail(req.body).then((result)=>{
            res.render('/')
        })


    },


    loginPage:(req,res)=>{
        try{
            res.render('/')
        }
        catch(error){
            res.render('error')
        }
    },

 
    userLogin:(req,res)=>{
        try{
            userlogin(req.body).then((response)=>{
                if(response.status && response.user.status){
                    req.session.loggedIn=true
                    req.session.user =response.user
                    res.redirect('/')
                }else{
                    req.session.loginErr=true
                    res.redirect('/usererror')
                }
            })
        }catch{
            res.redirect('/error')
        }
    },

    verifyemailjwt: (req, res) => {
        const token = req.query.token;
        const name = req.query.name;
        const email = req.query.email;
        var password = req.query.password;
        const mobile=req.query.mobile;

        console.log("passssssed", name);
        const secret = "mysecreatkey";
    
        jwt.verify(token, secret, function (err, decoded) {
          if (err) {
            console.log(err);
          } else {
            return new Promise(async (resolve, reject) => {
             password = await bcrypt.hash(password, 10);
              var userDetails = new userModel({
                name: name,
                email: email,
                password: password,
                mobile:mobile
              });
              userDetails.save().then((response) => {
                res.redirect("/");
              });
            });
         }
     });
},

otp:(req,res)=>{
    res.render('user/otp')
},
otperror:(req,res)=>{
    res.render('user/userblock')

},
cart:
(req,res,next)=>{
    let user=req.session.user

    if(user){

        next()
        
    }else{
        
    }
         
},
getcartproducts:(req,res)=>{
    let user=req.session.user;
    let userid=req.session.user._id;
    console.log('ids ids ids',userid,user);
    Getcartproducts(userid).then((data)=>{
        const total=data.reduce((total,data)=>{
            return total+data.productid.price*data.quantity;
        },0)
        console.log('total',total);
        global.total=total;
        data.total=total;
        console.log('cartdatatotal',data);
        res.render('user/cart',{user,data})

    })
},
requestotp:(req,res)=>{
    otprequest(req.body).then(()=>{
        res.redirect('/usererror')
        console.log('user is blocked');
    })


},
verifyotp:(req,res)=>{
    OTPsend(req.body).then((user)=>{
        console.log('login user',user);
        res.redirect('/')

    }).catch(()=>{
    res.render('user/otp')
    })
    
},
logout:(req,res)=>{
    req.session.destroy()
    res.redirect('/')

},
addtocart:(req,res)=>{
     
     const useridd=req.session.user._id
     console.log('reqbody',req.body.productid);

     Addtocart(req.body.productid,useridd).then((response)=>{  
        res.json({status:true})
    //   res.status(202) 

     })
},
changeproductquantity:(req,res,next)=>{
    let userid=req.session.user._id

    Changeproductquantity(req.body,userid).then((response)=>{
        res.json(response);
    })

},
removeproduct:(req,res)=>{
    const prodid=req.params.id;
    const userid=req.session.user._id
    console.log('prodddddd',prodid,userid);
    
    Removeproduct(prodid,userid).then(()=>{
        res.redirect('/cart')
    })

},
productpage:(req,res)=>{
    const id=req.params.id
    const user=req.session.user
    getproductdetails(id).then((data)=>{
        console.log('product details',data);
        res.render('user/product',{data,user})
        

    })

   

},
checkout:(req,res)=>{
    let user=req.session.user
    
    getaddress().then((ab)=>{
        const total=global.total
        console.log('response address',ab,total);
        res.render('user/checkout',{user,ab,total})
    })
   

},
address:(req,res)=>{
    let user=req.session.user
    res.render('user/address',{user})
},
saveaddress:(req,res)=>{
    console.log('reqbody',req.body);
    saveaddress(req.body).then((response)=>{
        console.log('address response',response);
        res.redirect('/manageaddress')
    })
},
getaddress:(req,res)=>{
    console.log('reqbody',req.body);
    Getaddress(req.body.id).then((response)=>{
        console.log('resolve address',response)
        res.json({status:true})
        
    })
        
   
},
 placeorder:(req,res)=>{
    let user=req.session.user
    let userid=req.session.user._id
    console.log('placeorder',req.body);
    saveorder(req.body,userid).then((response)=>{
        
        if(response.deliveredto.paymentmethod=='COD'){
            res.json(response)
        }else{
            razorpay(response).then((order)=>{
                
                res.json(order)
            })
           
           
        }
       
        
            
    })
}, 
applycoupon:(req,res)=>{
    console.log('reqbody',req.body);
    const id=req.body.id;
    const total=req.body.total

    couponapply(id,total).then((total)=>{
        res.json(total)
    })

},
vieworder:(req,res)=>{
    listorder().then((orders)=>{
        res.render('user/vieworders',{orders})
    })
    
},
viewshop:(req,res)=>{
    allproducts().then((products)=>{
        res.render('user/allproducts',{products})
    })
    
},
orderplaced:(req,res)=>{
    res.render('user/ordersuccess')
},
verifypayment:(req,res)=>{
    console.log('fsfdfs',req.body);
    let receipt=req.body['order[receipt]']
    
        VerifyPayment(req.body).then((response)=>{
             
            res.json({status:true})
            //  changePaymentStatus(receipt).then((response)=>{
            //  })
        }).catch((err)=>{
          res.json({status:false})
        })
  },
returnorder:(req,res)=>{
    const id=req.params.id
    orderreturn(id).then(()=>{
        res.redirect('/vieworders')
    })

},
cancelorder:(req,res)=>{
    const id=req.params.id
    ordercancel(id).then(()=>{
        res.redirect('/vieworders')
    })
}    


}