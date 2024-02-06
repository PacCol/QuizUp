var currentQuiz = {};

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
            currentQuiz = {
                "name": response.name,
                "id": response.id,
                "theme": response.theme,
                "questions_number": response.questions_number,
                "current_question": 0,
                "user_id": response.user_id,
                "username": response.username,
                "questions": []
            };
            let questions = response.questions.split("#");
            let responses = response.responses.split("#");
            for (let i = 0; i < response.questions_number; i++) {
                currentQuiz.questions.push({
                    "question": questions[i],
                    "answer": "?",
                    "response": responses[i * 4 + 0],
                    "option1": responses[i * 4 + 1],
                    "option2": responses[i * 4 + 2],
                    "option3": responses[i * 4 + 3],
                });
            }
            showSection("play");
            $("#no-active-game").hide();
            $("#quiz-results").hide();
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
    $("#current-question").text(currentQuiz.questions[i].question);
    order = [1, 2, 3, 4]
    order = order.sort(() => Math.random() - 0.5);
    console.log(currentQuiz.questions[i].response);
    $("#answer-" + order[0]).text(currentQuiz.questions[i].response);
    $("#answer-" + order[1]).text(currentQuiz.questions[i].option1);
    $("#answer-" + order[2]).text(currentQuiz.questions[i].option2);
    $("#answer-" + order[3]).text(currentQuiz.questions[i].option3);
    currentQuiz.current_question = i;
}

$(".answer").click(function() {
    currentQuiz.questions[currentQuiz.current_question].answer = $(this).text();
    if (currentQuiz.current_question < currentQuiz.questions_number - 1) {
        showQuestion(currentQuiz.current_question + 1)
    } else {
        $("#quiz").fadeOut(300).promise().done(function() {
            $("#quiz-results").fadeIn(300);
            $("#score-details").empty();
            let score = 0;
            for (let i = 0; i < currentQuiz.questions_number; i++) {
                if (currentQuiz.questions[i].response == currentQuiz.questions[i].answer) {
                    $("#score-details").append(`<button class="accordion-tab ripple-effect success">` + currentQuiz.questions[i].question + `</button>
                    <div class="panel">
                        <p>Bonne réponse. Il fallait en effet répondre: ` + currentQuiz.questions[i].answer + `</p>
                    </div>`);
                    score++;
                } else {
                    $("#score-details").append(`<button class="accordion-tab ripple-effect danger">` + currentQuiz.questions[i].question + `</button>
                    <div class="panel">
                        <p>Votre réponse: ` + currentQuiz.questions[i].answer + `</p>
                        <p>La réponse attendue était: ` + currentQuiz.questions[i].response + `</p>
                    </div>`);
                }
            }
            refreshAccordions();
            $("#score").text("Votre score: " + score + "/" + currentQuiz.questions_number);
        })
    }
});

$("#end-game").click(function() {
    endGame();
});

function endGame() {
    $("#no-active-game").show();
    $("#quiz").hide();
    showSection("explore");
}