var db = require("../models");

//Build api routes

module.exports = function(app){
    //Specify get post for user
    app.get("/api/login", (req, res) => {
        // //username and pass will come through body
        // console.log(req.body);
        // //Access DB and log user in
        // db.User.findAll({
        //     where: {
        //         username: req.body.username,
        //         password: req.body.password
        //     }
        // }).then(result => {
        //     console.log(result);
        //     res.end();
        //     // if (result.username !== req.body.username)
        //     //     res.status(500).json({message: "Could not find an account with that username or password. Please log in again with the correct credentials."});
        //     // res.status(200).json({message: "Successfully logged in."});
        // }).catch(err => {
        //     if (err)
        //     res.end();
        // })
    });

    //Specify post for user sign up
    app.post("/api/signup", (req, res) => {
        //Check if the username already exists
        db.User.findAll({
            where: {
                username: req.body.username
            }
        }).then(result => {
            console.log(result);
            if (result.length != 0){
                res.status(500).json({message: "User already exists, please sign up with a different username"});
            }
            else {
                db.User.create(req.body).then(created => {
                    res.json(created);
                }).catch(err => {
                    if (err)
                    res.status(500).json(err);
                })
            }
        }).catch(err => {
            res.status(500).json({message: err});
        })
        //Post to DB table the new users username and password and then login user and authenticate them.
    })
}