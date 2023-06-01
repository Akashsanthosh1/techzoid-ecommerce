var express = require('express');
var router = express.Router();
const{admin,usermanage,blockuser,unblockuser,productlist,addproduct,Addproduct,editproduct,
  deleteproduct,couponpage,addcoupon,savecoupon,deletecoupon,vieworder,orderdetail,statuschange}=require('../controller/admincontroller');
const multer = require('multer');
const storage= multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/images")
    },
    filename: (req, file, cb) => {

      cb(null,file.fieldname+"-"+file.originalname);
    },
  });

  const upload=multer({storage:storage})


router.get('/',admin);
router.get('/usermanage',usermanage);
router.get('/blockuser/:id',blockuser);
router.get('/unblockuser/:id',unblockuser)
router.get('/productlist',productlist);
router.get('/addproduct',addproduct);
router.get('/editproduct/:id',editproduct);
router.get('/deleteproduct/:id',deleteproduct);
router.get('/couponpage',couponpage);
router.get('/addcoupon',addcoupon);
router.post('/addcoupon',savecoupon);
router.get('/deletecoupon:id',deletecoupon);
router.get('/vieworder',vieworder);
router.get('/orderdetail:id',orderdetail);
router.post('/statuschange',statuschange)


//Setting storage engine

  const cpupload=upload.array("images",4);
  router.post('/addproduct',cpupload,Addproduct);


module.exports = router;
