// var db = require("../models");
const path = require("path");

//Build html routes

module.exports = function(app){
    //On index route send back index.html
    app.get("/", (req, res) => {
        res.render("index");
    })
    //On /user route return user.html
    app.get("/user", (req, res) => {
        res.render("user");
    })
}