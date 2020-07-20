//Express server setup
const express = require("express");
const app = express();
let PORT = process.env.PORT || 8080;
<<<<<<< HEAD
//Using handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//.env
=======
>>>>>>> 2689bde6a5c77e558b3bff0dee616d4fc3af628c
require("dotenv").config();

const moment = require("moment");
const bodyParser = require('body-parser')
<<<<<<< HEAD
=======
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
>>>>>>> 2689bde6a5c77e558b3bff0dee616d4fc3af628c

//Import db when built
var db = require("./models");

//Use JSON and expect nested objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Static folder public
app.use(express.static("public"));

//Use sessions
<<<<<<< HEAD
// const sessions = require("client-sessions");

// app.use(sessions({
//     cookieName: "session",
//     secret: process.env.cookieSecret,
//     duration: 20 * 60 * 1000 //20 minutes
// }))
=======
const sessions = require('client-sessions');
app.use(sessions({
    cookieName: "session",
    secret: process.env.cookieSecret,
    duration: 60 * 60 * 1000, // 60mins
    activeDuration: 5 * 60 * 1000 // +5mins if about to expire
}));

//Using handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
>>>>>>> 2689bde6a5c77e558b3bff0dee616d4fc3af628c

//Import routes HERE
require("./routes/html-routes")(app);
require("./routes/watchlist-api-routes")(app);
require("./routes/user-api-routes")(app);

//Listening on port
db.sequelize.sync({force: true}).then(function() {
    app.listen(PORT, function() {
        console.log("Server listening on: http://localhost:" + PORT);
    });
});