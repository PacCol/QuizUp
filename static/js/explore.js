var currentQuiz = {};
var goodResponses = 0;

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
                                                <th>${getThemeFromNumber(response[i].theme)}</th>
                                                <th>${response[i].username}</th>
                                                <th>${response[i].questions_number}</th>
                                                <th><button class="btn btn-sp primary ripple-effect" onclick="startQuiz(${response[i].id})">Jouer</button></th>
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

function startQuiz(id) {
    loader(true);
    $.ajax({
        type: "GET",
        url: "/quiz?id=" + id.toString(),
        contentType: "application/json",

        success: function(response) {
            loader(false);
            currentQuiz = response;
            showSection("play");
            $("#no-active-game").hide();
            $("#quiz").show();
            $("#quiz-title").text(response.name);
            console.log(response);
            showQuestion(0);
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
}

function showQuestion(i) {
    $("#current-question-number").text("Question " + (i + 1) + "/" + currentQuiz.questions_number);
    $("#current-question").text(currentQuiz.questions.split("#")[i]);
    let solution = currentQuiz.responses.split("#")[i * 4];
    let answer1 = currentQuiz.responses.split("#")[i * 4 + 1];
    let answer2 = currentQuiz.responses.split("#")[i * 4 + 2];
    let answer3 = currentQuiz.responses.split("#")[i * 4 + 3];
    order = [1, 2, 3, 4]
    order = order.sort(() => Math.random() - 0.5);
    $("#answer-" + order[0]).text(solution);
    $("#answer-" + order[1]).text(answer1);
    $("#answer-" + order[2]).text(answer2);
    $("#answer-" + order[3]).text(answer3);
}

$("#end-game").click(function() {
    endGame();
});

function endGame() {
    $("#no-active-game").show();
    $("#quiz").hide();
    showSection("explore");
}