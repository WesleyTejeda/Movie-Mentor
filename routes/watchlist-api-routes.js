var db = require("../models");

//Build api routes

module.exports = function(app){
   //Save watchlist to DB 
   app.post("/api/watchlist", (req, res) => {
      req.body.UserId = req.session.userId;
      console.log(req.body, "watchlist post path");
      db.Watchlist.create(req.body).then((created) => {
         console.log(created);
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
         },
      }).then(results => {
         if(results.length === 0){
            res.json({message: "No results"})
         }
         //returns all results in an array of objects
         res.json(results);
      }).catch(err => {
         res.status(501).json({message: err});
     });
   })

   app.delete("/api/watchlist", (req, res) => {
     db.Watchlist.destroy({
       where: {
         listTitle: req.body.listTitle
       }
     }).then(response => {
        resstatus(200).json({message: "Title removed"});
     }).catch(err => {
         res.status(501).json({message: err});
     });
   })
}