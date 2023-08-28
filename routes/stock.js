var express = require('express');
var router = express.Router();
var pool=require("./pool")

router.get('/homepage', function(req, res, next) {
    res.render('homepage',{result:2});
  });

router.get('/dashboardhomepage', function(req, res, next) {
    res.render('dashboardhomepage',{result:2});
  });

router.get('/productinformation', function(req, res, next) {
  pool.query("select S.*,(select PN.productname from products PN where PN.productid=S.productid) as productname, (select D.description from products D where D.productid=S.productid) as description, (select I.icon from products I where I.productid=S.productid) as icon from stocks S",function(error,result){
    if(error){
      res.render('productinformation',{result:[]});  
    }else{
      res.render('productinformation',{result:result});
    }
  })
  });

module.exports = router;