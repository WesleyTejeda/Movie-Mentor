
$(document).ready(function() {

    $("#logoutModal").on("click", function (event) {
        event.preventDefault();
        $.post("/logout", function () {
            console.log("Logged out");
        })
    })

    $("#userNameBtn").on("click", function (event) {
        event.preventDefault();
        $.get("/user", function () {
            console.log("User Page");
        })
    })

    var getData = (title) => {
        let apiKey = "3699bcfd1aa3d5642b631dafd0a6d76e"
        let searchUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + apiKey + "&language=en-US&query=" + title + "&page=1&include_adult=false";

        title = title.replace(/(, )/g, "+");

        $.ajax({
            url: searchUrl,
            method: "GET"
        }).then((result) => {
            var result = results[0];

            var searchObj = {
                image: result.poster_path,
                resultTitle: result.title,
                popularity: result.popularity,
                description: result.overview,
                releaseDate: result.release_date,
                movieOrShow: result.media_type,
                genre: [
                    result.genre_ids
                ]
            };
            result = JSON.parse(searchObj);

            console.log(result);

            renderResults(result);
        });
    }


    $(searchBtn).on("click", function () {
        getData(searchText.val());
        searchText.val("");
    });
});

renderResults = (newMovieData) => {
    newCard = ("#newCard");
    $("#cardGroup").append(newCard);
    var newImage = $("<img>");
    newImage.attr("src", newMovieData.image);
    newImage.attr("alt", "Movie Image");
    $("#cardImage").append(newImage);
    newCard.append("#cardImage");
    var title = `<p><strong>Title: </strong>${newMovieData.resultTitle}</p>`;
    newCard.append(title);
    var popularity = `<p><strong>Rating: </strong>${newMovieData.popularity}</p>`;
    newCard.append(popularity);
    var description = `<p><strong>Summary: </strong>${newMovieData.description}</p>`;
    newCard.append(description);
    var releaseDate = `<p><strong>Released: </strong>${newMovieData.releaseDate}</p>`;
    newCard.append(releaseDate);
    var type = `<p><strong>Movie/TV Show: </strong>${newMovieData.movieOrShow}</p>`;
    newCard.append(type);
    var genre = `<p><strong>Genre: </strong>${newMovieData.genre}</p>`;
    newCard.append(genre);

};