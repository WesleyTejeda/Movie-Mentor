$(document).ready(async function() {
    let searchForm = $("#searchForm");
    let inputField = $("#inputField");
    let genreList = await getGenres();

    //Search Modal
    var modal = $("#myModal");
    var searchBtn = $("#searchBtn");
    var searchSpan = $("#searchSpan");
    searchBtn.on("click", function () {
      modal.css("display", "block");
    });
    searchSpan.on("click", function () {
      modal.css("display", "none");
    });
    //WatchList Modal
    var watchListModal = $("#watchListModal");

    var watchListBtn = $("#watchListButton");
    var watchListSpan = $("#watchListSpan");
    watchListBtn.on("click", function () {
        watchListModal.css("display", "block");
        $.get("/api/watchlist").then(watchlist => {
            getWatchListData(watchlist);
        })  
    });
    watchListSpan.on("click", function () {
        $(".modal-backdrop").css("display","none");
        watchListModal.css("display", "none");
    });

    $("select").on("change", function() {
        let value = $(this).val();
        // let text = $(this).html();
        $.post("/user/query", {value}).then(response => {
            // $("#queryTitle").html()
            appendNewData(response);
            $(".searchThis").on("click", function() {
                modal.css("display", "block");
                let title = $(this).data("title");
                getData(title);
            })
        })
    })

    $(".searchThis").on("click", function() {
        modal.css("display", "block");
        let title = $(this).data("title");
        getData(title);
    })


    $("#logout").on("click", function (event) {
        event.preventDefault();
        $.post("/logout").then(function (data, status, xhr) {
            if (xhr.status === 200){
                window.location.replace("/");
            }
        })
    })

    $("#userNameBtn").on("click", function (event) {
        event.preventDefault();
        $.get("/user", function () {
        })
    })

    const getData = async (title) => {
        let apiKey = "3699bcfd1aa3d5642b631dafd0a6d76e"
        let queryUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + apiKey + "&language=en-US&query=" + title + "&page=1&include_adult=false";

        title = title.replace(/(, )/g, "+");

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(async (results) => {
            let result = results.results[0];

            let country = "N/A";
            if(result.origin_country){
                if(typeof(result.origin_country === "object"))
                    country = result.origin_country[0];
                else country = result.origin_country;
            }

            let searchObj = {
                listTitle: (result.original_name || result.original_title),
                image: result.poster_path,
                popularity: (result.popularity).toFixed(0),
                description: result.overview,
                releaseDate: (result.first_air_date || result.release_date),
                movieOrShow: (result.media_type).toUpperCase(),
                genre: result.genre_ids[0],
                voteAvg: result.vote_average,
                movieId: result.id,
                country: (country || "N/A")
            };
            let type = result.media_type;
            let recommendedHtml = await getRecommended(type, result.id);
            let videoSrc = await getVideos(type, result.id);

            //Append popup search below
            let searchHtml = 

            `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-5 col-sm-12 p-0">
                        <img class="p-0 mr-4 img-fluid" id="searchImage" src="http://image.tmdb.org/t/p/w400${searchObj.image}"/>
                    </div>
                    <div class="col-md-5 col-sm-12 searchModal p-0 ml-5 mr-10">
                    <h2 class="text-center">${searchObj.listTitle}</h2>
                        <p id="description">${searchObj.description}</p>
                        <p>Country: ${searchObj.country} </p>
                        <p>Popularity Score: ${searchObj.popularity}</p>
                        <p>Vote: ${searchObj.voteAvg}/10</p>
                        <p>Release Date: ${searchObj.releaseDate}</p>
                        <p>Media Type: ${searchObj.movieOrShow}</p>
                        <button class="watchlistBtn"><i class="fas fa-plus"></i> Add to Watchlist</button>
                        <div class="videoWrapper col-xs-8">
                            <iframe id="ytplayer" type="text/html"
                            src="https://www.youtube.com/embed/${videoSrc}?autoplay=0"
                            frameborder="0"></iframe>
                        </div>
                    </div>
                </div>
            </div>    
            <div class="row">${recommendedHtml}</div>`;
            $("#searchModalBody").empty();
            $("#searchModalBody").html(searchHtml);
            $(".recommended").on("click", function() {
                let title = $(this).data("title");
                getData(title);
            })

            $.get("/api/watchlist").then(results => {
                if(results.length !== 0){
                    for(let i=0; i < results.length; i++){
                        if(results[i].listTitle === searchObj.listTitle){
                            $(".watchlistBtn").css("background-color","blue");
                            $(".watchlistBtn").html("Title Added");
                        }
                    }
                }
            })

            $(".watchlistBtn").on("click", function() {
                if ($(this).html() === "Title Added"){
                    return;
                }
                searchObj.trailer = `https://www.youtube.com/embed/${videoSrc}?autoplay=0`;
                $.post("/api/watchlist", searchObj);
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
    const getWatchListData = (watchlist) => {
        let listings = ``;
        for (let i = 0; i < watchlist.length; i++) {
          listings += `
          <div class="container-fluid">
            <div class="row gradientBg text-white watchlistRow">
                <div class="col-md-5 col-sm-12 p-0">
                    <img class="p-0 ml-3 watchlistImg" src="http://image.tmdb.org/t/p/w400${watchlist[i].image}"/>
                </div>
                <div class="col-md-5 col-sm-12 searchModal p-0 ml-5 mr-10 text-white">
                    <button class="remove" data-title="${watchlist[i].listTitle}"><i class="far fa-trash-alt"></i> Remove From Watchlist</button>
                    <p id="description">${watchlist[i].description}</p>
                    <p>Country: ${watchlist[i].country} </p>
                    <p>Popularity Score: ${watchlist[i].popularity}</p>
                    <p>Vote: ${watchlist[i].voteAvg}/10</p>
                    <p>Release Date: ${watchlist[i].releaseDate}</p>
                    <p>Media Type: ${watchlist[i].movieOrShow}</p>
                    <div class="videoWrapper" col-xs-8">
                        <iframe id="ytplayer" type="text/html" src=${watchlist[i].trailer}frameborder="0"></iframe>
                    </div>
                </div>
            </div>
        </div>`;
        }
        $("#watchListModal").html(listings);
        $(".remove").on("click", function() {
            if($(this).html() === "Removed"){
                return;
            }
            else {
                $(this).css("background-color", "gray");
                $(this).css("color", "black");
                $(this).html("Removed");
                let title = $(this).data("title");
                $.ajax({
                    url: "/api/watchlist",
                    method: "DELETE",
                    data: {listTitle: title}
                })
            }
        })
    };
    function appendNewData(response) {
        $("#appendListings").empty();
        let newHtml = ``;
        for(let i=0; i < response.listings.length; i++) {
            newHtml += `<figure class="card-body col-2 p-0 m-3">
            <img class="card-img pb-1 borderedRound searchThis" data-title="${response.listings[i].listTitle}" src="http://image.tmdb.org/t/p/w200${response.listings[i].image}" alt="Poster of ${response.listings[i].listTitle}">
        </figure>`
        }
        $("#appendListings").html(newHtml);
    }

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
                    if(results.results[i].type === "Trailer" || "Teaser"){
                        src = results.results[i].key;
                        resolve(src);
                    }
                }
                resolve("");
            })
        })
    }

    function getRecommended(type, id) {
        return new Promise(resolve => {
            $.get(`https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=3699bcfd1aa3d5642b631dafd0a6d76e&language=en-US&page=1`).then(results => {
                let recommendedHtml = `<h2 class="text-center w-100 mt-5">Recommended Titles</h2>`;
                for(let i=0; i < results.results.length && i < 8; i++) {
                    let title = results.results[i].original_title || results.results[i].original_name;
                    recommendedHtml += 
                    `<div class="card-body col-3 p-0 ">
                        <img class="ml-6 mt-3 mb-3 center recommended" src="http://image.tmdb.org/t/p/w185${results.results[i].poster_path}" data-title="${title}"/>
                        <p class="text-center w-100 text-white">${title}</p>
                    </div>`;
                }
                resolve(recommendedHtml);
            })
        })
    }
});
