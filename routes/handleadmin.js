var express = require('express');
var router = express.Router();
var pool = require('./pool')
var localstorage=require("node-localstorage").LocalStorage
var localStorage=new localstorage("./scratch")

router.get('/adminlogin', function (req, res, next) {
    res.render('adminlogin',{message:""});
});

router.get('/adminlogout', function (req, res, next) {
    
    localStorage.clear()
    res.render('adminlogin',{message:""});
});

router.post("/dashboard",function(req,res,next){
    pool.query("select * from admininfo where emailid=?",[req.body.email],function(error,result){
        if(error){
          res.render("adminlogin",{message:"Server error..."})
        }else{
          if(result.length==1){
               pool.query("select * from admininfo where emailid=? and password=?",[req.body.email,req.body.pwd],function(error,result){
                 if(error){
                   res.render("adminlogin",{message:"Server error..."})
                 }else{
                    if(result.length==1){
                      localStorage.setItem("ADMIN",JSON.stringify(result))
                      res.render("dashboard",{admin:result[0]})
                    }else{
                      res.render("adminlogin",{message:"Invalid password..."})
                    }
                 }
               })
          }else{
            res.render("adminlogin",{message:"Invalid admin id..."})
          }
        }
      })
  })

module.exports=router