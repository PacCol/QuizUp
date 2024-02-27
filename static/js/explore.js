var currentQuiz = {};
var score = 0;

$(document).ready(function() {
    loadQuizs();
});

$("#explore-button").click(function() {
    loadQuizs();
});

// Cette fonction charge et affiche les différents quizs disponibles sur une page (ou affiche une erreur si il y a une erreur réseau du côté de l'utilisateur)
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

// C'est une fonction qui récupère les données d'un quiz sur lequel l'utilisateur a cliqué pour jouer, et qui affiche ensuite la première question du quiz et lss choix de réponses 
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

// C'est une fonction qui affiche les différentes questions du quiz actuel les unes après les autres et qui affiche les différents choix de réponse possibles pour la question actuelle
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

// C'est une fonction qui récupère la réponse sur laquelle l'utilisateur a cliqué et qui lui indique ensuite si il a juste ou pas
$(".answer").click(function() {
    currentQuiz.questions[currentQuiz.current_question].answer = $(this).text();
    if (currentQuiz.current_question < currentQuiz.questions_number - 1) {
        showQuestion(currentQuiz.current_question + 1)
    } else {
        $("#quiz").fadeOut(300).promise().done(function() {
            $("#quiz-results").fadeIn(300);
            $("#score-details").empty();
            score = 0;
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

// C'est une fonction qui met fin au quiz lorsqu'il est terminé
function endGame() {
    $("#no-active-game").show();
    $("#quiz").hide();
    $("#quiz-results").hide();
    showSection("explore");
}

// Cette fonction permet d'envoyer les résultats au serveur pour les enregistrer
$("#save-results").click(function() {
    loader(true);
    $.ajax({
        type: "POST",
        url: "/results",
        data: JSON.stringify({ "rightAnswers": score, "falseAnswers": (currentQuiz.questions_number - score) }),
        contentType: "application/json",

        success: function() {
            loader(false);
            alertBox("Validé", "Vos résultats ont été enregistrés.", `
                    <button class="btn btn-sp primary btn-align-right ripple-effect cancel">Fermer</button>`);
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
    endGame();
});