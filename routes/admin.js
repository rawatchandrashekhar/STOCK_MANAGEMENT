var express = require('express');
var router = express.Router();
var pool=require("./pool")
var upload=require("./multer")
var localstorage=require("node-localstorage").LocalStorage
var localStorage=new localstorage("./scratch")

router.get('/addproduct', function(req, res, next) {
  try{
    if(localStorage.getItem("ADMIN")==null){
      res.render('adminlogin',{message:""});    
    }
    else{
      res.render('addproduct',{result:2});
    }
  }catch(e){
    res.render('adminlogin',{message:""});
  }  
  });

router.post("/insertproductrecord",upload.single("productpicture"),function(req,res){
    console.log("BODY",req.body)
    console.log("BODY",req.file)
    pool.query("insert into products(productname,description,icon) value(?,?,?)",[req.body.productname,req.body.description,req.file.originalname],function(error,result){
        if(error){
            res.render('addproduct',{result:0})
        }else{
            res.render('addproduct',{result:1})
        } 
    })
})

router.get('/addstock', function(req, res, next) {
  try{
    if(localStorage.getItem("ADMIN")==null){
      res.render('adminlogin',{message:""});    
    }
    else{
      res.render('addstock',{result:2});
    }
  }catch(e){
    res.render('adminlogin',{message:""});
  }
  });

router.post("/insertstockrecord",function(req,res){
    pool.query("insert into stocks(productid,stock) value(?,?)",[req.body.productid,req.body.stock],function(error,result){
        if(error){
            res.render('addstock',{result:0})
        }else{
            res.render('addstock',{result:1})
        } 
    })
})

router.get('/displayallstockdata', function (req, res, next) {
  try{
    if(localStorage.getItem("ADMIN")==null){
      res.render('adminlogin',{message:""});    
    }
  }catch(e){
    res.render('adminlogin',{message:""});
  }
  pool.query("select S.*,(select PR.productname from products PR where PR.productid=S.productid) as productname from stocks S",function(error,result){
    if(error){
      res.render('displayallstockdata',{result:[]});  
    }else{
      res.render('displayallstockdata',{result:result});
    }
  })
});

router.get('/updatestock', function (req, res, next) {
  pool.query("select S.*,(select PR.productname from products PR where PR.productid=S.productid) as productname from stocks S where stockid=?",[req.query.sid],function(error,result){
    if(error){
      res.render('updatestock',{result:[]});  
    }else{
      res.render('updatestock',{result:result[0]});
    }
  })
});

router.get('/update_delete_stock', function (req, res, next) {
  if(req.query.btn=="Update"){
    pool.query("update stocks set stock=?,productid=? where stockid=?", [req.query.stock,req.query.productid,req.query.sid],function(error,result){
      if(error){
        res.redirect("/admin/displayallstockdata")
      }else{
        res.redirect("/admin/displayallstockdata")
      }
    })
  }else{
    pool.query("delete from stocks where stockid=?",[req.query.sid],function(error,result){
      if(error){
        res.redirect("/admin/displayallstockdata")
      }else{
        res.redirect("/admin/displayallstockdata")
      }
    })
  }  
})

router.get('/displayallproductdata', function (req, res, next) {
  try{
    if(localStorage.getItem("ADMIN")==null){
      res.render('adminlogin',{message:""});    
    }
  }catch(e){
    res.render('adminlogin',{message:""});
  }
    pool.query("select * from products",function(error,result){
      if(error){
        res.render('displayallproductdata',{result:[]});  
      }else{
        res.render('displayallproductdata',{result:result});
      }
    })
  });
  
router.get("/fetchallproducts",function(req,res){
  pool.query("select * from products",function(error,result){
        if(error){
            res.status(500).json([])
        }else{
            res.status(200).json(result)
        }
    })
})

router.post("/updateproducticon",upload.single("newpicture"),function(req,res,next){
    pool.query("update products set icon=? where productid=?",[req.file.originalname,req.body.pid],function(error,result){
      if(error){
        res.redirect("/admin/displayallproductdata")
      }else{
        res.redirect("/admin/displayallproductdata")
      }
    })
  })

router.get('/updateproduct', function (req, res, next) {
    pool.query("select * from products where productid=?",[req.query.pid],function(error,result){
      if(error){
        res.render('updateproduct',{result:[]});  
      }else{
        res.render('updateproduct',{result:result[0]});
      }
    })
});

router.get('/update_delete_product', function (req, res, next) {
  if(req.query.btn=="Update"){
    pool.query("update products set productname=?,description=? where productid=?", [req.query.productname,req.query.description,req.query.pid],function(error,result){
      if(error){
        res.redirect("/admin/displayallproductdata")
      }else{
        res.redirect("/admin/displayallproductdata")
      }
    })
  }else{
    pool.query("delete from products where productid=?",[req.query.pid],function(error,result){
      if(error){
        res.redirect("/admin/displayallproductdata")
      }else{
        res.redirect("/admin/displayallproductdata")
      }
    })
  }  
})
  
module.exports = router;