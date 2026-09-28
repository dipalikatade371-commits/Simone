var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');
var session=require('express-session');
const fileUpload=require('express-fileupload');
var path = require('path');

router.use(express.static('public'));
var conn=mysql.createConnection({
    host:'bd4xmdmkpdwvdcjaf1be-mysql.services.clever-cloud.com',
    user:'u7e9qv2kzzdjkhuw',
    password:'P0Gfqn8K3tFUXoj3W92O',
    database:'bd4xmdmkpdwvdcjaf1be',
})
var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({extended:true}));
router.use(session({
   secret:'A2ZITHUB',
   resave:false,
   saveUninitialized:true
}))
router.use(fileUpload());

function logincheck(req,res,next){
   if(req.session.name){
next();
   }else{
      res.redirect('/admin')
   }
}

router.get('/',(req,res)=>{
//res.send('admin')
res.render('admin/login.ejs');
})

router.post('/login_check',async(req,res)=>{
    // res.send('welcome');
    //res.redirect('/admin/dashboard');
    //res.send(req.body);
    var {username,password}=req.body;
    //res.send(username);
    var sql='select  * from login where username=? and password=?';
    var data=await exe(sql,[username,password])
   // res.send(data);
   if(data[0]){
      //session data store
      req.session.id=data[0].lid;
      req.session.name=data[0].name;
    res.redirect('/admin/dashboard');
   }else{
    res.redirect('/admin/');
   }

})

 router.get('/dashboard',logincheck,(req,res)=>{
  // res.send(req.session.name);
  var name=req.session.name;
   res.render('admin/dashboard.ejs',{name:name});
})

 router.get('/form',(req,res)=>{
   //res.send('dashboard');
   res.render('admin/form.ejs');
})

 router.get('/table',(req,res)=>{
   //res.send('dashboard');
   res.render('admin/table.ejs');
})

router.get('/logout',(req,res)=>{
   req.session.destroy();
    res.redirect('/admin');
})

router.get('/service_add',(req,res)=>{
   res.render('admin/service_add.ejs');
})

router.post('/service_save',async(req,res)=>{
  // res.send(req.body);
  var{ s_icons, s_title, s_desc}=req.body;
  var sql='insert into service( s_icons, s_title, s_desc)values(?,?,?)';
  var data=await exe(sql,[ s_icons, s_title, s_desc]);
  //res.send('done');
  res.redirect('/admin/service_add');
})

router.get('/service_list', async (req, res) => {
   var sql = 'select * from service';
    var data = await exe(sql);
 res.render('admin/service_list.ejs', { service: data });

});

router.get('/work_add',(req,res)=>{
   res.render('admin/work_add.ejs');
})

router.post('/work_save',async(req,res)=>{

   var{w_title,w_desc}=req.body;

   var w_img='';

   if(req.files && req.files.w_img){

      var file=req.files.w_img;

      w_img=Date.now()+file.name;

      file.mv('public/image/'+w_img);

   }

   var sql='insert into work(w_img,w_title,w_desc)values(?,?,?)';

   var data=await exe(sql,[w_img,w_title,w_desc]);

   res.redirect('/admin/work_add');

})

router.get('/work_list',async(req,res)=>{

   var sql='select * from work';

   var data=await exe(sql);

   res.render('admin/work_list.ejs',{work:data});

})

router.get('/delete_work/:id',async(req,res)=>{

   var id=req.params.id;

   var sql='delete from work where sid=?';

   var data=await exe(sql,[id]);

   res.redirect('/admin/work_list');

})

router.get('/education_add',(req,res)=>{
   res.render('admin/education_add.ejs');
})

router.post('/education_save',async(req,res)=>{
  // res.send(req.body);
  var{ e_year, e_degree,e_uni, e_desc}=req.body;
//   year,degre,uni,desc

  var sql='insert into education(  e_year, e_degree,e_uni, e_desc)values(?,?,?,?)';
  var data=await exe(sql,[ e_year, e_degree,e_uni, e_desc]);
  //res.send('done');
  res.redirect('/admin/education_add');
})

router.get('/education_list', async (req, res) => {

   var sql = 'select * from education';

   var data = await exe(sql);

   res.render('admin/education_list.ejs', { data1: data });
});
router.get('/delete_education/:id',async(req,res)=>{

   var id=req.params.id;

   var sql='delete from education where sid=?';

   var data=await exe(sql,[id]);

   res.redirect('/admin/education_list');

})



router.get('/experience_add',(req,res)=>{
   res.render('admin/experience_add.ejs');
})

router.post('/experience_save',async(req,res)=>{
  // res.send(req.body);
  var{ d_year, d_posi,d_comp, d_desc}=req.body;
// 	year,posi,comp,desc

  var sql='insert into experience(  d_year, d_posi,d_comp, d_desc)values(?,?,?,?)';
  var data=await exe(sql,[ d_year, d_posi,d_comp, d_desc]);
  //res.send('done');
  res.redirect('/admin/experience_add');
})

router.get('/experience_list', async (req, res) => {

   var sql = 'select * from experience';

   var data = await exe(sql);

   res.render('admin/experience_list.ejs', { data2: data });
});
router.get('/delete_experience/:id',async(req,res)=>{

   var id=req.params.id;

   var sql='delete from experience where sid=?';

   var data=await exe(sql,[id]);

   res.redirect('/admin/experience_list');

})


router.get('/skills_add',(req,res)=>{
   res.render('admin/skills_add.ejs');
})

router.post('/skills_save',async(req,res)=>{
  // res.send(req.body);
  var{ s_tech,s_per}=req.body;


  var sql='insert into skills( s_tech,s_per)values(?,?)';
  var data=await exe(sql,[  s_tech,s_per]);
  //res.send('done');
  res.redirect('/admin/skills_add');
})

router.get('/skills_list', async (req, res) => {

   var sql = 'select * from skills';

   var data = await exe(sql);

   res.render('admin/skills_list.ejs', { data3: data });
});

router.get('/home_update',async(req,res)=>{
   var sql='select * from home where id=1';
   var data=await exe(sql);
   res.render('admin/home_update.ejs',{data:data[0]});
})

router.post('/home_update_save/:id/:img',async(req,res)=>{
   var id=req.params.id;
   var oldimg=req.params.img;
   var{h_title1,h_title2,h_title3,h_desc}=req.body;

   if(req.files && req.files.h_img){
      //new
      var img=req.files.h_img;
      var imgname=req.files.h_img.name;
      var myphoto=Date.now()+imgname;
      var imgpath=path.join(__dirname,'../','public/image',myphoto);

      await img.mv(imgpath);
   }else{
      var myphoto=oldimg;
   }

   var sql='update home set h_img=?,h_title1=?,h_title2=?,h_title3=?,h_desc=? where id=?';

   var data=await exe(sql,[myphoto,h_title1,h_title2,h_title3,h_desc,id]);

   res.redirect('/admin/home_update');
})
router.get('/about_update',async(req,res)=>{
   var sql='select * from about where id=1';
   var data=await exe(sql);
   res.render('admin/about_update.ejs',{data:data[0]});
})

router.post('/about_update_save/:id',async(req,res)=>{

   var id=req.params.id;

   var{a_name,a_title,a_desc1,a_desc2,a_email,a_age,a_from,a_experience,a_clients,a_projects,a_awards}=req.body;

   var sql='update about set a_name=?,a_title=?,a_desc1=?,a_desc2=?,a_email=?,a_age=?,a_from=?,a_experience=?,a_clients=?,a_projects=?,a_awards=? where id=?';

   var data=await exe(sql,[a_name,a_title,a_desc1,a_desc2,a_email,a_age,a_from,a_experience,a_clients,a_projects,a_awards,id]);

   res.redirect('/admin/about_update');

})
router.get('/contact_pending',async(req,res)=>{
   var sql='select * from contact_data where status=? ';
   data=await exe(sql,['pending']);
   //res.send(data[0]);
   res.render('admin/contact_pending.ejs',{data:data});
})

router.get('/contact_pending_confirm/:id',async(req,res)=>{
   var id=req.params.id;
   var sql='update contact_data set status=? where cid=? ';
   data=await exe(sql,['confirm',id]);
   //res.send(data[0]);
   res.redirect('/admin/contact_pending');
})
router.get('/contact_pending_reject/:id',async(req,res)=>{
   var id=req.params.id;
   var sql='update contact_data set status=? where cid=? ';
   data=await exe(sql,['reject',id]);
   //res.send(data[0]);
   res.redirect('/admin/contact_pending');
})

router.get('/contact_complete',async(req,res)=>{
   var sql='select * from contact_data where status=? ';
   data=await exe(sql,['confirm']);
   //res.send(data[0]);
   res.render('admin/contact_complete.ejs',{data:data});
})

router.get('/contact_reject',async(req,res)=>{
   var sql='select * from contact_data where status=? ';
   data=await exe(sql,['reject']);
   //res.send(data[0]);
   res.render('admin/contact_reject.ejs',{data:data});
})

router.get('/delete_service/:id',async(req,res)=>{

    var id=req.params.id;

    var sql='delete from service where sid=?';

    var data=await exe(sql,[id]);

    res.redirect('/admin/service_list');

})
router.get('/delete_skills/:id',async(req,res)=>{
   var id=req.params.id;

   var sql='delete from skills where sid=?';

   var data=await exe(sql,[id]);

   res.redirect('/admin/skills_list');
})
router.get('/client_add',(req,res)=>{
   res.render('admin/client_add.ejs');
})

router.post('/client_save',async(req,res)=>{

   var{c_name,c_position,c_desc}=req.body;

   var c_img='';

   if(req.files && req.files.c_img){

      var file=req.files.c_img;

      c_img=Date.now()+file.name;

      file.mv('public/image/'+c_img);

   }

   var sql='insert into client(c_img,c_name,c_position,c_desc)values(?,?,?,?)';

   var data=await exe(sql,[c_img,c_name,c_position,c_desc]);

   res.redirect('/admin/client_add');

})

router.get('/client_list',async(req,res)=>{

   var sql='select * from client';

   var data=await exe(sql);

   res.render('admin/client_list.ejs',{data:data});

})

router.get('/delete_client/:id',async(req,res)=>{

   var id=req.params.id;

   var sql='delete from client where cid=?';

   var data=await exe(sql,[id]);

   res.redirect('/admin/client_list');

})

module.exports=router;
