// var db = require("../models");
// const path = require("path");
const authentication = require("../config/authenticated/authentication");
//Build html routes

module.exports = function(app){
    //On index route send back index.html
    app.get("/", (req, res) => {
        res.render("index");
    })
    //On /user route return user.html
    app.get("/user", authentication, (req, res) => {
        res.render("user");
    });
    
    app.post("/logout", (req, res) => {
        // Set a cookie with past expiry to overwrite current cookie
        res.cookie("session", process.env.cookieSecret, {expires: new Date(0)});
        //Redirect back to index
        res.redirect("/");
    })
}