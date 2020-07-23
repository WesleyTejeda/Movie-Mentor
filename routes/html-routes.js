// var db = require("../models");
// const path = require("path");
const authentication = require("../config/authenticated/authentication");
const axios = require('axios');
const fs = require("fs");
const path = require("path");
const { query } = require("express");
//Build html routes

module.exports = function(app){
    //On index route send back index.html
    app.get("/", (req, res) => {
        res.render("index");
    })
    //On /user route return user.html


    app.get("/user", authentication, async (req, res) => {
        console.log(req.body);
        let genreList = await getGenres();
        let listingArray = [];
        
        function getGenres() {
            return new Promise(resolve => {
                axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US").then(genres => {
                    let genreList = [genres.data.genres];
                    axios.get("https://api.themoviedb.org/3/genre/tv/list?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US").then(genres => {
                    genreList.push(genres.data.genres);
                    resolve(genreList);
                    }).catch(err => {
                        if (err)
                        res.status(501).json(err);
                    })
                }).catch(err => {
                    if (err)
                    res.status(501).json(err);
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
                listingArray.push(obj);
            }
            res.render("user", {listings: listingArray, genreMovie: genreList[0], genreTv: genreList[1], username: req.session.username});
        }).catch(err => {
            if (err)
            res.status(501).json(err);
        })

    });
    
    //User sends value through select, render the page that corresponds
    app.post("/user/query", authentication, async (req, res) => {
        console.log(req.body);
        let genreList = await getGenres();
        let listingArray = [];
        let trendingQuery = "https://api.themoviedb.org/3/trending/all/week?api_key=3699bcfd1aa3d5642b631dafd0a6d76e";
        let discoverMovieQuery = "https://api.themoviedb.org/3/discover/movie?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
        let discoverTvQuery = "https://api.themoviedb.org/3/discover/tv?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false";
        let topQuery = "https://api.themoviedb.org/3/movie/top_rated?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&page=1";
        let upcomingQuery = "https://api.themoviedb.org/3/movie/upcoming?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&page=1";
        if(req.body.value === ""){
            res.status(200).json({message: "It's okay I won't refresh"})
        }
        //Check if section select changed
        switch (req.body.value){
            case "A": 
                listingArray = await multiData(trendingQuery);
                respond(listingArray)
                break;
            case "B": 
                listingArray = await multiData(discoverMovieQuery);
                respond(listingArray)
                break;
            case "C": 
                listingArray = await multiData(discoverTvQuery);
                respond(listingArray)
                break;
            case "D": 
                listingArray = await multiData(topQuery);
                respond(listingArray)
                break;
            case "E": 
                listingArray = await multiData(upcomingQuery);
                respond(listingArray)
                break;
        }
        console.log(listingArray);
        //Check if either movie or tv changed
        //Movie
        let genreQuery = ``;
        let type = "";
        for(let i=0; i < genreList[0].length; i++){
            console.log(genreList[0][i]);
            if(genreList[0][i].id == req.body.value){
                console.log("match found");
                type = "movie";
                genreQuery = `https://api.themoviedb.org/3/discover/${type}?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&with_genres=${genreList[0][i].id}&include_null_first_air_dates=false`
                console.log(genreQuery);
                listingArray = await multiData(genreQuery);
                respond(listingArray);
            }
        }
        //Tv
        for(let i=0; i < genreList[1].length; i++){
            if(genreList[1][i].id == req.body.value){
                console.log("match found");
                type = "tv";
                genreQuery = `https://api.themoviedb.org/3/discover/${type}?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&with_genres=${genreList[0][i].id}&include_null_first_air_dates=false`
                console.log(genreQuery);
                listingArray = await multiData(genreQuery);
                respond(listingArray);
            }
        }
        //If not found
        res.status(500).json({message: "Search query not found. No refresh!"});

        function respond(listingArray) {
            res.send({listings: listingArray, genreMovie: genreList[0], genreTv: genreList[1]});
        }
        function multiData(queryUrl) {
            return new Promise(resolve => {
                axios.get(queryUrl).then(response => {
                    let arr = [];
                    for(let i=0; i < response.data.results.length; i++){
                        let obj = {
                            listTitle: (response.data.results[i].original_name || response.data.results[i].original_title),
                            image: response.data.results[i].poster_path,
                            movieOrShow: (response.data.results[i].media_type),
                            movieId: response.data.results[i].id,
                            rating: response.data.results[i].vote_average
                        };
                        arr.push(obj);
                    }
                    resolve(arr);
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
                    }).catch(err => {
                        if (err)
                        res.status(501).json(err);
                    })
                }).catch(err => {
                    if (err)
                    res.status(501).json(err);
                })
            })
        }
    });

    app.post("/logout", (req, res) => {
        // Set a cookie with past expiry to overwrite current cookie
        res.cookie("session", process.env.cookieSecret, {expires: new Date(0)});
        //Redirect back to index
        res.status(200).json({message: "Logged out"});
    })
}