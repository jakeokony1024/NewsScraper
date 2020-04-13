$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id +
            "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        console.log(data[i].title)
        console.log(data[i].link)
    }
});

function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
        articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
}

function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
        $("<h3>").append(
            $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", article.url)
            .text(article.headline),
            $("<a class='btn btn-success save'>Save Article</a>")
        )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
}

// $(document).on("click", "p", function () {
//     $("#notes").empty();
//     let thisId = $(this).attr("data-id");
//     $.ajax({
//             method: "GET",
//             url: "/articles/" + thisId
//         })
//         .then(function (data) {
//             console.log(data);
//             $("#notes").append("<h2>" + data.title + "</h2>");
//             $("#notes").append("<input id='titleinput' name='title' >");
//             $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//             $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//             if (data.note) {
//                 $("#titleinput").val(data.note.title);
//                 $("#bodyinput").val(data.note.body);
//             }
//         });
// });

$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .then(function (data) {
            console.log(data)
            $("#notes").empty();
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
})

// $(".scrape-new").on("click", function () {
//     $.getJSON("/articles", function (data) {
//         // For each one
//         for (var i = 0; i < data.length; i++) {
//             // Display the apropos information on the page
//             $("#articles").append("<p data-id='" + data[i]._id +
//                 "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//         }
//     });
// });

// function renderArticles(articles) {
//     // This function handles appending HTML containing our article data to the page
//     // We are passed an array of JSON containing all available articles in our database
//     var articleCards = [];
//     // We pass each article JSON object to the createCard function which returns a bootstrap
//     // card with our article data inside
//     for (var i = 0; i < articles.length; i++) {
//         articleCards.push(createCard(articles[i]));
//     }
//     // Once we have all of the HTML for the articles stored in our articleCards array,
//     // append them to the articleCards container
//     articleContainer.append(articleCards);
// }

// function createCard(article) {
//     // This function takes in a single JSON object for an article/headline
//     // It constructs a jQuery element containing all of the formatted HTML for the
//     // article card
//     var card = $("<div class='card'>");
//     var cardHeader = $("<div class='card-header'>").append(
//         $("<h3>").append(
//             $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
//             .attr("href", article.url)
//             .text(article.headline),
//             $("<a class='btn btn-success save'>Save Article</a>")
//         )
//     );

//     var cardBody = $("<div class='card-body'>").text(article.summary);

//     card.append(cardHeader, cardBody);
//     // We attach the article's id to the jQuery element
//     // We will use this when trying to figure out which article the user wants to save
//     card.data("_id", article._id);
//     // We return the constructed card jQuery element
//     return card;
// }

// $(document).on("click", "p", function () {
//     $("#notes").empty();
//     let thisId = $(this).attr("data-id");
//     $.ajax({
//             method: "GET",
//             url: "/articles/" + thisId
//         })
//         .then(function (data) {
//             console.log(data);
//             $("#notes").append("<h2>" + data.title + "</h2>");
//             $("#notes").append("<input id='titleinput' name='title' >");
//             $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//             $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//             if (data.note) {
//                 $("#titleinput").val(data.note.title);
//                 $("#bodyinput").val(data.note.body);
//             }
//         });
// });

// $(document).on("click", "#savenote", function () {
//     var thisId = $(this).attr("data-id");

//     $.ajax({
//             method: "POST",
//             url: "/articles/" + thisId,
//             data: {
//                 title: $("#titleinput").val(),
//                 body: $("#bodyinput").val()
//             }
//         })
//         .then(function (data) {
//             console.log(data)
//             $("#notes").empty();
//         });
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });