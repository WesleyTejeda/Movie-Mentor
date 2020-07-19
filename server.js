//Express server setup
const express = require("express");
const app = express();
//Env Port or 8080
let PORT = process.env.PORT || 8080;
//Using handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Import db when built
var db = require("./models");

//Use JSON and expect nested objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Static folder public
app.use(express.static("public"));

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