$(document).ready(function() {
    loadQuizs();
});

$("#explore-button").click(function() {
    loadQuizs();
});

function loadQuizs() {
    loader(true);
    $.ajax({
        type: "GET",
        url: "/quizs",
        contentType: "application/json",

        success: function(response) {
            loader(false);
            $("#explore tbody").empty();
            for (let i = 0; i < response.length; i++) {
                $("#explore tbody").append(`<tr>
                                                <th>${response[i].name}</th>
                                                <th>${response[i].theme}</th>
                                                <th>${response[i].username}</th>
                                                <th></th>
                                            </tr>`);
            }
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
}