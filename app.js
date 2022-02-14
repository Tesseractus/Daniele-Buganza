var express = require("express");
var path = require("path");
var routes = require("./routes");
const session = require("express-session");
//----------------------------------------------------
//Defining the main function
var app=express();
//Defining the access port
app.set("port", process.env.PORT || 3000);
//----------------------------------------------------
//Defining session relues for login
app.use(session({
    secret:'justALitleSecretForDaniele',
    resave: true,
    saveUnintialized: true,
}));
//----------------------------------------------------
//Setting views path
app.set("views", path.join(__dirname, "Public/Views"));
//Defining what kind of view to use
app.set("view engine", "ejs");
//Specify the pubblic folder
app.use(express.static(__dirname+'/Public'));
app.use(express.static(path.join(__dirname, 'static')));
//Specify the json rule
app.use(express.json());
app.use(express.urlencoded());
//----------------------------------------------------
//Setting the routes
app.use(routes);
//Defining the listen function
app.listen(app.get("port"),function(){
    console.log("Server started on port "+app.get("port"));
})