//Express server setup
const express = require("express");
const app = express();
//Env Port or 8080
let PORT = process.env.PORT || 8080;
//Import db when built
// var db = require("../models");

//Use JSON and expect nested objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Static folder public
app.use(express.static("public"));

//Import router HERE


//Listening on port
app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
});