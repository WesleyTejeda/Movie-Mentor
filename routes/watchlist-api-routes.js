var db = require("../models");

//Build api routes

module.exports = function(app){
   //Save watchlist to DB 
   app.post("/api/watchlist", (req, res) => {
      console.log(req.body);
      db.Watchlist.create(req.body).then(() => {
         res.status(200).json({message: "Added to watchlist!"});
      }).catch(err => {
         res.status(501).json({message: err});
     })
   })

   //Build out route for returning watchlist contents
   app.get("/api/watchlist", (req, res) => {
      console.log(req.session);
      db.Watchlist.findAll({
         where: {
            UserId: req.session.userId
         }
      }).then(results => {
         if(results === []){
            res.json({message: "No results"})
         }
         //returns all results in an array of objects
         res.json(results);
      }).catch(err => {
         res.status(501).json({message: err});
     });
   })
}