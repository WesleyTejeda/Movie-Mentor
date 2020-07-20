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
        if (!(req.session && req.session.userId))
            return res.redirect("/");

        User.findById(req.session.userId, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect("/");
            }

            res.render("user");
        });
        // res.render("user");
    });
    
    
}