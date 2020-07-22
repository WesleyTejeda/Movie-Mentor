// var db = require("../models");
// const path = require("path");
const authentication = require("../config/authenticated/authentication");
const axios = require('axios');
//Build html routes

module.exports = function(app){
    //On index route send back index.html
    app.get("/", (req, res) => {
        res.render("index");
    })
    //On /user route return user.html
    app.get("/user", authentication, async (req, res) => {
        let genreList = await getGenres();
        let listingArray = [];
        let trendingQuery = "https://api.themoviedb.org/3/trending/all/week?api_key=3699bcfd1aa3d5642b631dafd0a6d76e";
        let discoverMovieQuery = "https://api.themoviedb.org/3/discover/movie?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
        let discoverTvQuery = "https://api.themoviedb.org/3/discover/tv?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false";
        let topQuery = "https://api.themoviedb.org/3/movie/top_rated?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&page=1";
        let upcomingQuery = "https://api.themoviedb.org/3/movie/upcoming?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&page=1";
        function multiData(queryUrl) {
            return new Promise(resolve => {
                axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=3699bcfd1aa3d5642b631dafd0a6d76e").then(response => {
                    for(let i=0; i < response.data.results.length; i++){
                        let obj = {
                            listTitle: (response.data.results[i].original_name || response.data.results[i].original_title),
                            image: response.data.results[i].poster_path,
                            movieOrShow: (response.data.results[i].media_type).toUpperCase(),
                            movieId: response.data.results[i].id,
                            rating: response.data.results[i].vote_average
                        };
                        console.log(obj);
                        listingArray.push(obj);
                    }
                })
            })
        }
        function getGenres() {
            return new Promise(resolve => {
                axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US").then(genres => {
                    let genreList = [genres.data.genres];
                    axios.get("https://api.themoviedb.org/3/genre/tv/list?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US").then(genres => {
                    genreList.push(genres.data.genres);
                    resolve(genreList);
                    })
                })
            })
        }
        axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=3699bcfd1aa3d5642b631dafd0a6d76e").then(response => {
            for(let i=0; i < response.data.results.length; i++){
                let obj = {
                    listTitle: (response.data.results[i].original_name || response.data.results[i].original_title),
                    image: response.data.results[i].poster_path,
                    movieOrShow: (response.data.results[i].media_type).toUpperCase(),
                    movieId: response.data.results[i].id,
                };
                console.log(obj);
                listingArray.push(obj);
            }
            res.render("user", {listings: listingArray, genreMovie: genreList[0], genreTv: genreList[1]});
        })
    });
    
    app.post("/logout", (req, res) => {
        // Set a cookie with past expiry to overwrite current cookie
        res.cookie("session", process.env.cookieSecret, {expires: new Date(0)});
        //Redirect back to index
        res.status(200).json({message: "Logged out"});
    })
}