var db = require("../models");
const moment = require("moment");
const bcrypt = require("bcryptjs");

//Build api routes

module.exports = function(app){
    //Specify get post for user
    app.post("/api/login", (req, res) => {
        //username and pass will come through body
        console.log(req.body);
        //Access DB and log user in
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            console.log(user);
            // console.log(user["password"]);

            if (user === null)
                res.status(500).json({message: "Could not find an account with that username or password. Please log in again with the correct credentials."});
            else {
                //Compare hashed password to database hashed pw
                let login = bcrypt.compareSync(req.body.password, user.password);
                if(!login){
                    res.json({message: "Incorrect password. Please re-enter credentials"})
                }
                //Save session id
                req.session.userId = user._id;
                // res.redirect("/user");
                res.status(300).json({message: "Logged in"});
            }
        }).catch(err => {
            if (err)
            res.status(501).json(err);
        })
    });

    //Specify post for user sign up
    app.post("/api/signup", (req, res) => {
        //Check if the username already exists
        db.User.findAll({
            where: {
                username: req.body.username
            }
        }).then(user => {
            console.log(user);
            if (user.length !== 0){
                res.status(500).json({message: "User already exists, please sign up with a different username"});
            }
            else {
                let time = moment().format("YYYY-MM-DD");
                let hashed = bcrypt.hashSync(req.body.password);
                let userCredentials = {
                    username: req.body.username,
                    password: hashed,
                    createdAt: time,
                    updatedAt: time
                };
                //Post to DB table the new users username and password and then login user and authenticate them.
                db.User.create(userCredentials).then(created => {
                    res.json(created);
                }).catch(err => {
                    if (err)
                        res.status(502).json(err);
                })
            }
        }).catch(err => {
            res.status(501).json({message: err});
        })
    })
}