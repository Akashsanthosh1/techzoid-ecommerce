var db = require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const userModel = require("../models/user-models")
const productSchema=require("../models/product-schema")
const { loginPage } = require('../controller/userController')
const couponschema=require('../models/coupon-schema')
const orderSchema = require('../models/order-schema')

module.exports={

    getuser:()=>{
        return new Promise(async(resolve, reject) => {
           const getuser=await  userModel.find()
           resolve(getuser)
        })

    },
    blockuser:(id)=>{
        return new Promise(async(resolve, reject) => {
            await userModel.updateOne({_id:id},{$set:{status:false}})
           var userblock= await userModel.findOne({_id:id})
            resolve();
        })

    },
    unblockuser:(id)=>{
        return new Promise(async(resolve, reject) => {
            await userModel.updateOne({_id:id},{$set:{status:true}})
           var userblock= await userModel.findOne({_id:id})
            resolve();
        })

    },
    saveproduct:(data,filename)=>{
        return new Promise((resolve, reject) => {

            var productdetails=new productSchema({
                name:data.name,
                description:data.description,
                brand:data.brand,
                price:data.price,
                category:data.category,
                image:filename,


            })
            productdetails.save()
            console.log('new product added');

            resolve()
            
        })
    },
    getproducts:()=>{
        return new Promise(async(resolve, reject) => {
            const products=await productSchema.find()
        resolve(products)
        })
    },
    deleteproduct:(id)=>{
        return new Promise(async(resolve, reject) => {
            await productSchema.findByIdAndRemove({_id:id})
            console.log('response',response);
            resolve(response)
        })
    },
    editproduct:(id)=>{
        return new Promise(async(resolve, reject) => {
           const editproduct= await productSchema.findOne({_id:id})
            console.log('edit response',response);
            resolve(editproduct)
        })
    },
    couponsave:(data)=>{
        return new Promise(async(resolve, reject) => {
            let coupondetails=await new couponschema({
                couponid:data.couponid,
                expirydate:data.expirydate,
                percentageoffer:data.percentageoffer,
                maxoffer:data.maxoffer

            })
            coupondetails.save()
            resolve()
        })

    },
    viewcoupons:()=>{
        return new Promise(async(resolve, reject) => {
            const coupons=await couponschema.find()
            resolve(coupons)
        })
    },
    coupondelete:(id)=>{
        return new Promise(async(resolve, reject) => {
            await couponschema.findByIdAndDelete(id)
            resolve()
        })
    },
    getorders:()=>{
        return new Promise(async(resolve, reject) => {
            let orders=await orderSchema.find()
           
            resolve(orders)
        })
    },
    getdetail:(id)=>{
        return new Promise(async(resolve, reject) => {
            let order=await orderSchema.findById(id).populate("productids.productid")
            console.log('gffgh',order.productids);
            resolve(order)
        })
    },
    changestatus:(id,status)=>{
        console.log('sfs',id,'faffa',status);
        return new Promise(async(resolve, reject) => {
        await orderSchema.updateOne({_id:id},{"deliveredto.status":status})
        let order=await orderSchema.findById(id)
             console.log("updated status order",order);
            resolve(order)
           
          
           
        })
    }
    

}
