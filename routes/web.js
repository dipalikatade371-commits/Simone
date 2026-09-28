 var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');
router.use(express.urlencoded({extended:true}));

router.use(express.static('public'));
var conn=mysql.createConnection({
    host:'bd4xmdmkpdwvdcjaf1be-mysql.services.clever-cloud.com',
    user:'u7e9qv2kzzdjkhuw',
    password:'P0Gfqn8K3tFUXoj3W92O',
    database:'bd4xmdmkpdwvdcjaf1be',
})
var exe=util.promisify(conn.query).bind(conn);

router.get('/',async(req,res)=>{
    var sql='select * from home where id=1';
   var data=await exe(sql);
res.render('web/index.ejs',{data:data[0]});
})

router.get('/about',async(req,res)=>{

    var sql='select * from about where id=1';

    var data=await exe(sql);

    res.render('web/about.ejs',{data:data[0]});

})

router.get('/services',async(req,res)=>{
    var sql='select * from service';
    var data=await exe(sql);
res.render('web/services.ejs' ,{data:data});
})
router.get('/resume', async(req,res)=>{

    var sql = "select * from education";
    var data1 = await exe(sql);

    var sql = "select * from experience";
    var data2 = await exe(sql);

    var sql3 = "select * from skills";
    var data3 = await exe(sql3);

    res.render('web/resume.ejs', {
        data1: data1,
        data2: data2,
        data3: data3
    });

});



router.get('/portfolio',async(req,res)=>{
    var sql='select * from work';
    var data=await exe(sql);

    res.render('web/portfolio.ejs',{work:data});
})
router.get('/clients',async(req,res)=>{

    var sql='select * from client';

    var data=await exe(sql);

    res.render('web/clients.ejs',{data:data});

})
router.get('/contact',(req,res)=>{
res.render('web/contact.ejs');
})

router.post('/contact_save',async(req,res)=>{
   // res.send('contact_save');
  // res.send(req.body);
  var {name,email,message}=req.body;
  var da=new Date();
  var date1=da.getDate()+"-"+Number(da.getMonth()+1)+"-"+da.getFullYear();
  //res.send(date1);
  var sql='insert into contact_data(name,email,message,status,c_date)values(?,?,?,?,?)';
  var data=await exe (sql,[name,email,message,'pending',date1]);
  res.redirect('/contact');
})

module.exports = router;
