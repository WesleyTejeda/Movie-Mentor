var db = require("../models");

//Build api routes

module.exports = function(app){
   //Save watchlist to DB 
   app.post("/api/watchlist", (req, res) => {
      db.Watchlist.create(req.body).then(() => {
         res.status(200).json({message: "Added to watchlist!"});
      })
   })

   //Build out route for returning watchlist contents
   app.get("/api/watchlist", (req, res) => {
      db.Watchlist.findAll({
         where: {
            username: req.session.userId
         }
      }).then(results => {
         if(results === []){
            res.json({message: "No results"})
         }
         //returns all results in an array of objects
         res.json(results);
      })
   })
}