const { response } = require("../app");
var {getuser,blockuser,unblockuser,saveproduct,getproducts,deleteproduct,editproduct,
    viewcoupons,couponsave,coupondelete,getorders,getdetail,changestatus}=require('../helpers/product-helpers')
var db=require('../config/connection')
var userModel=require('../models/admin-model')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const layout="adminlayout";
var productmodel=require('../models/product-schema')

module.exports={
    admin:(req,res)=>{
        res.render('admin/adminindex',{layout})
    },
    usermanage:(req,res)=>{
       
        getuser().then((data)=>{
            console.log('userdata',data);
            res.render('admin/usermanage',{layout,data})
           

        })
       

        
    },
    blockuser:(req,res)=>{
            const id=req.params.id;
            console.log(id,'blockuser id');
            blockuser(id).then(()=>{
                console.log('user blocked');
                res.redirect('/admin/usermanage')
            
            })
    },
    unblockuser:(req,res)=>{
        const id=req.params.id;
        console.log(id,'unblockuser id');
            unblockuser(id).then(()=>{
                console.log('user unblocked');
                res.redirect('/admin/usermanage')
            
            })


    },
    productlist:(req,res)=>{
        getproducts().then((data)=>{
            console.log('products',data);
            res.render('admin/productlist',{layout,data})
        })
       
    },
    addproduct:(req,res)=>{
        res.render('admin/addproduct',{layout})
},
Addproduct:(req,res)=>{
    console.log('product data',req.body);
    console.log('image deatails',req.files);
    const filename=req.files.map((file)=>{
        return file.filename
    })
console.log('filename',filename);
    saveproduct(req.body,filename).then(()=>{
        res.redirect('/admin/addproduct')
    })
},
editproduct:(req,res)=>{
    const id=req.params.id
    console.log('edit product id',id);
    editproduct(id).then((data)=>{
        console.log('edit product data',data);
        res.render('admin/editproduct',{layout,data})
    })

},
deleteproduct:(req,res)=>{
    const id=req.params.id
    console.log('callback id',id);
    deleteproduct(id).then((response)=>{
        res.redirect('/admin/productlist')
    })
},
couponpage:(req,res)=>{
    viewcoupons().then((response)=>{
        console.log('coupon response',response);
        res.render('admin/couponlist',{layout,response})
    })
    
},
addcoupon:(req,res)=>{
    
    res.render('admin/addcoupon',{layout})
},
savecoupon:(req,res)=>{
    console.log('reqbody',req.body);
    couponsave(req.body).then(()=>{
        console.log('new coupon added');
        res.redirect('/admin/couponpage')
    })
},
deletecoupon:(req,res)=>{
    const id=req.params.id
    console.log('id',id);
    coupondelete(id).then(()=>{
        res.redirect('/admin/couponpage')
    })
},
vieworder:(req,res)=>{
    getorders().then((data)=>{
        res.render('admin/vieworder',{data,layout})
    })
    

},
orderdetail:(req,res)=>{
    const id=req.params.id
    console.log('params id',id);
    getdetail(id).then((order)=>{
        let product=order.productids
        console.log('total product',product);
        res.render('admin/orderdetail',{layout,order,product})
    })
    
},
statuschange:(req,res)=>{
    console.log('reqbody',req.body);
    let orderid=req.body.orderid
    let status=req.body.status
    changestatus(orderid,status).then((response)=>{
        res.json(response) 
    })
}
}