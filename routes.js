var express = require("express");
var router=express.Router();
var bcrypt = require("bcrypt");

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage});
var multer = require('sharp');

const loginData=[{
    username: 'daniele',
    password: '$2b$10$7aKh4vmtahmkcXpNkLX/Y.06Dr9IHUaW2Qe2kgx0J2Ok9cX1gfAwC'
  }];

//Importing categories path

router.get("/", function(req,res){
    res.render("home");
    
});
router.get("/biografia", function(req,res){
    res.render("biografia.ejs");
});
router.get("/galleria",function(req,res){
    res.render("galleria.ejs");
});
router.get("/pubblicazioni", function(req,res){
    res.render("pubblicazioni.ejs");
})
router.get("/login", function(req,res){
    res.render("login.ejs");
})
router.get("/administration",function(req,res){
    if(req.session.loggedin){
        res.render("administration.ejs");
    }else{
        return res.status(400).render("login.ejs",{errMessage:"Login neccessario"});
    }
})
router.post("/auth",async function(req,res){
    /* const HP=await bcrypt.hash(req.body.password, 10);
     console.log(req.body);
     const u={name:req.body.username, password:HP };
     loginData.push(u);
     res.status(201).send('saved');
     console.log(loginData); */
     const user=loginData.find(user => user.username === req.body.username);
     if(user==null){
         return res.status(400).render("login.ejs",{errMessage:"Nome utente non valido"});
     }
     try{
         if(await bcrypt.compare(req.body.password, user.password)){
             req.session.loggedin= true;
             req.session.cookie.maxAge=20*60*1000;
             res.redirect("/administration");
 
         }else{
             return res.status(400).render("login.ejs",{errMessage:"Password non valida"});
         }
         res.end();
     }catch{
         return res.status(400).render("login.ejs",{errMessage:"Errore del server non previsto"});
     }
 })
router.post("/adminAction",upload.single('Opera'), async function(req,res){
    var tools= require("./Utility/utilityDatabase.js");
    var message;
    switch(req.body.typeRequest){
        case 'addCategory':
            message={response:tools.createCategory(req.body.nameCategory)};
            break;
        case 'modifyCategory':
            message={response:tools.modifyCategory(req.body.categorySelected,req.body.newNameCategory)};
            break;
        case 'removeCategory':
            message={response:tools.removeCategory(req.body.categorySelected)};
            break;
        case 'addSubcategory':
            message={response:tools.createSubcategory(req.body.categorySelected,req.body.nameSubcategory)};
            break;
        case 'modifySubcategory':
            console.log(req.body);
            message={response:tools.modifySubcategory(req.body.categorySelected,req.body.subcategorySelected,req.body.newNameSubCategory)};
            break;
        case 'removeSubcategory':
            message={response:tools.removeSubcategory(req.body.categorySelected,req.body.subcategorySelected)};
            break;
        case 'addArt':
            message={response: await tools.addArt(req.body,req.file)};
            break;
        
        case 'removeArt':
            message={response: await tools.removeArt(req.body.artToDelete)};
            break;
        case 'addPhotoBiography':
            message={response:await tools.addPhotoBiography(req.file)};
            break;
        case 'removePhotoBiography':
            
            message={response:await tools.removePhotoBiography(req.body.photoToDelete)};
            break;
        default:
            console.log("Pagina non valida",req.body);
            message={response:"Pagina non valida:"};
    }
    res.render("administration.ejs",message);
})
module.exports=router;
