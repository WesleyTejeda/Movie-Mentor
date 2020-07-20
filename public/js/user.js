
$(document).ready(async function() {
    let searchForm = $("#searchForm");
    let inputField = $("#inputField");
    let genreList = await getGenres();
    console.log(genreList);

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

    const getData = (title) => {
        let apiKey = "3699bcfd1aa3d5642b631dafd0a6d76e"
        let searchUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + apiKey + "&language=en-US&query=" + title + "&page=1&include_adult=false";

        title = title.replace(/(, )/g, "+");

        $.ajax({
            url: searchUrl,
            method: "GET"
        }).then((results) => {
            let result = results.results[0];
            console.log(result);

            let searchObj = {
                image: result.poster_path,
                resultTitle: result.title,
                popularity: result.popularity,
                description: result.overview,
                releaseDate: result.release_date,
                movieOrShow: result.media_type,
                genre: result.genre_ids
            };
            console.log(searchObj);
            //Append popup search below
            // let searchDiv = $("<div>").addClass("popOut");
            // searchDiv.html("sample");
            // $("main").append(searchDiv)
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