var db = require("../models");

//Build api routes

module.exports = function(app){
    //Specify get post for user
    app.get("/api/login", (req, res) => {
        //Access DB and log user in
    });

    //Specify post for user sign up
    app.post("/api/signup", (req, res) => {
        //Post to DB table the new users username and password and then login user and authenticate them.
    })
}