
$(document).ready(async function() {
    let searchForm = $("#searchForm");
    let inputField = $("#inputField");
    let genreList = await getGenres();
    console.log(genreList);

    //Search Modal
    var modal = $("#myModal");
    var searchBtn = $("#searchBtn");
    var span = $(".close");
    searchBtn.on("click", function() {
        modal.css("display", "block");
    })
    span.on("click", function() {
        modal.css("display", "none");
    })

    $("#logout").on("click", function (event) {
        event.preventDefault();
        console.log("LOG OUT");
        $.post("/logout").then(function (data, status, xhr) {
            console.log(status, data, xhr.status);
            if (xhr.status === 200){
                window.location.replace("/");
            }
        })
    })

    $("#userNameBtn").on("click", function (event) {
        event.preventDefault();
        $.get("/user", function () {
            console.log("User Page");
        })
    })

    $("#watchlistBtn").on("click", function (event) {
        event.preventDefault();
        $.get("/api/watchlist", function () {
            console.log("Watchlist Page");
        })
    })

    const getData = async (title) => {
        let apiKey = "3699bcfd1aa3d5642b631dafd0a6d76e"
        let searchUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + apiKey + "&language=en-US&query=" + title + "&page=1&include_adult=false";

        title = title.replace(/(, )/g, "+");

        $.ajax({
            url: searchUrl,
            method: "GET"
        }).then(async (results) => {
            let result = results.results[0];
            console.log(result);
            // let genre = result.genre_ids;
            // genre.forEach()
            let searchObj = {
                listTitle: result.original_name,
                image: result.poster_path,
                popularity: (result.popularity).toFixed(0),
                description: result.overview,
                releaseDate: result.first_air_date,
                movieOrShow: (result.media_type).toUpperCase(),
                genre: result.genre_ids[0],
                voteAvg: result.vote_average,
                movieId: result.id,
                country: (result.origin_country || "N/A")
            };
            console.log(searchObj);
            let type = result.media_type;
            let recommendedHtml = await getRecommended(type, result.id);
            let videoSrc = await getVideos(type, result.id);

            //Append popup search below
            let searchHtml = 
            `
            <div class="row">
                <h2 class="text-center col-12">${searchObj.listTitle}</h2>
                <div class="col-5 p-0">
                    <img class="p-0 ml-3" src="http://image.tmdb.org/t/p/w400${searchObj.image}"/>
                </div>
                <div class="col-5 searchModal p-0 ml-5">
                    <p>${searchObj.description}</p>
                    <p>Country: ${searchObj.country} </p>
                    <p>Popularity Score: ${searchObj.popularity}</p>
                    <p>Vote: ${searchObj.voteAvg}/10</p>
                    <p>Release Date: ${searchObj.releaseDate}</p>
                    <p>Media Type: ${searchObj.movieOrShow}</p>
                    <button class="watchlistBtn"><i class="fas fa-plus"></i> Add to Watchlist</button>
                    <iframe id="ytplayer" type="text/html" width="640" height="360"
                    src="https://www.youtube.com/embed/${videoSrc}?autoplay=1"
                    frameborder="0"></iframe>
                </div>
            </div>
            <div class="row">${recommendedHtml}</div>`;
            $("#searchModalBody").html(searchHtml);
            $(".recommended").on("click", function() {
                console.log("clicked");
                let title = $(this).data("title");
                console.log(title);
                getData(title);
            })

            $.get("/api/watchlist").then(results => {
                console.log(results);
                results.forEach(listing => {
                    if (listing.listTitle === searchObj.listTitle){
                        $(".watchlistBtn").css("background-color","blue");
                        $(".watchlistBtn").html("Title Added");
                    }
                })
            })

            $(".watchlistBtn").on("click", function() {
                if ($(this).html() === "Title Added"){
                    return;
                }
                let obj = {
                    listTitle: searchObj.listTitle,
                    image: searchObj.image,
                    listId: searchObj.movieId
                }
                console.log(searchObj);
                $.post("/api/watchlist", obj);
                $(this).css("background-color","blue");
                $(this).html("Title Added");
            })
        });
    }


    $(searchForm).on("submit", function (event) {
        event.preventDefault();
        let search = inputField.val();
        getData(search);
    });

    function getGenres() {
        return new Promise(resolve => {
            $.get("https://api.themoviedb.org/3/genre/movie/list?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US").then(genres => {
                let genreList = genres;
                resolve(genreList);
            })
        })
    }

    function getVideos(type, id) {
        return new Promise(resolve => {
            $.get(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US`).then(results => {
                let src = "";
                for(let i=0; i < results.results.length; i++){
                    if(results.results[i].type === "Trailer"){
                        src = results.results[i].key;
                        resolve(src);
                    }
                }
            })
        })
        
    }

    function getRecommended(type, id) {
        return new Promise(resolve => {
            $.get(`https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&page=1`).then(results => {
                let recommendedHtml = `<h2 class="text-center w-100 mt-5">Recommended Titles</h2>`;
                for(let i=0; i < 8; i++) {
                    recommendedHtml += 
                    `<div class="card-body col-3 p-0 ">
                        <img class="ml-3 mt-3 center recommended" src="http://image.tmdb.org/t/p/w185${results.results[i].poster_path}" data-title="${results.results[i].original_name}"/>
                        <p class="text-center w-100">${results.results[i].original_name}</p>
                    </div>`;
                }
                resolve(recommendedHtml);
            })
        })
    }

    
});

// renderResults = (newMovieData) => {
//     newCard = ("#newCard");
//     $("#cardGroup").append(newCard);
//     var newImage = $("<img>");
//     newImage.attr("src", newMovieData.image);
//     newImage.attr("alt", "Movie Image");
//     $("#cardImage").append(newImage);
//     newCard.append("#cardImage");
//     var title = `<p><strong>Title: </strong>${newMovieData.resultTitle}</p>`;
//     newCard.append(title);
//     var popularity = `<p><strong>Rating: </strong>${newMovieData.popularity}</p>`;
//     newCard.append(popularity);
//     var description = `<p><strong>Summary: </strong>${newMovieData.description}</p>`;
//     newCard.append(description);
//     var releaseDate = `<p><strong>Released: </strong>${newMovieData.releaseDate}</p>`;
//     newCard.append(releaseDate);
//     var type = `<p><strong>Movie/TV Show: </strong>${newMovieData.movieOrShow}</p>`;
//     newCard.append(type);
//     var genre = `<p><strong>Genre: </strong>${newMovieData.genre}</p>`;
//     newCard.append(genre);

// };