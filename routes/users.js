var express = require('express');
const { response } = require('../app');
const { verifyLogin } = require('../controller/userController');
const { index, 
    loginPage,
     userLogin, 
     verifyemail, 
     verifyemailjwt,
      otp, otperror,
       cart, getcartproducts, 
       requestotp, verifyotp, logout,
        addtocart, changeproductquantity,
         removeproduct, checkout ,productpage,address,saveaddress,getaddress,placeorder,applycoupon,vieworder,viewshop,
        orderplaced,verifypayment,returnorder,cancelorder} = require('../controller/userController');
const userHelper = require('../helpers/user-helpers');


var router = express.Router();
router.get('/', index,);
router.get('/login', loginPage);
router.post('/login', userLogin);
router.post('/signup', verifyemail);
router.get('/verify', verifyemailjwt);
router.get('/otp', otp);
router.get('/usererror', otperror);
router.get('/cart', cart, getcartproducts);
router.post('/requestotp', requestotp);
router.post('/verifyotp', verifyotp);
router.get('/logout', logout);
router.post('/addtocart', addtocart);
router.post('/changeproductquantity', changeproductquantity);
router.get('/removeproduct/:id', removeproduct);
router.get('/checkout', checkout);
router.get('/product:id', productpage)
router.post('/placeorder',placeorder)
router.get('/manageaddress',address);
router.post('/saveaddress',saveaddress);
router.post('/getaddress',getaddress);
router.post('/applycoupon',applycoupon);
router.get('/vieworders',vieworder);
router.get('/shop',viewshop);
router.get('/orderplaced',orderplaced);;
router.get('/returnorder:id',returnorder)
router.post('/verifypayment',verifypayment);
router.get('/cancelorder:id',cancelorder);

module.exports = router;
