var questionsNumber = 10;
var themeNumber = 1

$("#new-button").click(function() {
    displayFields();
})

// C'est une fonction qui génère dynamiquement des champs de question pour créer un quiz
function displayFields() {
    $("#questions").empty();
    $("#question-number-dropdown .btn-badge").text(questionsNumber);
    for (let i = 0; i < questionsNumber; i++) {
        $("#questions").append(`<button class="accordion-tab ripple-effect primary">Question ` + (i + 1).toString() + `</button>
                                <div class="panel">
                                    <div class="modern-input primary">
                                        <input type="text" id="question-` + (i + 1).toString() + `-q" placeholder=" " autocomplete="off">
                                        <p>Question ` + (i + 1).toString() + `</p>
                                    </div>
                                    <div class="modern-input success">
                                        <input type="text" id="question-` + (i + 1).toString() + `-s" placeholder=" " autocomplete="off">
                                        <p>Solution</p>
                                    </div>
                                    <div class="modern-input danger">
                                        <input type="text" id="question-` + (i + 1).toString() + `-1" placeholder=" " autocomplete="off">
                                        <p>Choix (faux) 1</p>
                                    </div>
                                    <div class="modern-input danger">
                                        <input type="text" id="question-` + (i + 1).toString() + `-2" placeholder=" " autocomplete="off">
                                        <p>Choix (faux) 2</p>
                                    </div>
                                    <div class="modern-input danger">
                                        <input type="text" id="question-` + (i + 1).toString() + `-3" placeholder=" " autocomplete="off">
                                        <p>Choix (faux) 3</p>
                                    </div>
                                </div>`);
    }
    refreshAccordions();
}

$("#question-number-dropdown .dropdown-content button").click(function() {
    questionsNumber = $(this).data("value");
    displayFields();
});

$("#theme-dropdown .dropdown-content button").click(function() {
    themeNumber = $(this).data("value");
    $("#theme-dropdown .btn-badge").text(getThemeFromNumber(themeNumber));
});

// C'est une fonction qui s'active lorsqu'on clique sur le bouton "publier", et qui envoie les données du formulaire au serveur (ou pas si erreur)
$("#publish-button").click(function() {
    loader(true);
    var questionsList = "";
    for (let i = 0; i < questionsNumber; i++) {
        questionsList = questionsList + $("#question-" + (i + 1).toString() + "-q").val() + "#";
    }
    var responsesList = "";
    for (let i = 0; i < questionsNumber; i++) {
        responsesList = responsesList + $("#question-" + (i + 1).toString() + "-s").val() + "#";
        responsesList = responsesList + $("#question-" + (i + 1).toString() + "-1").val() + "#";
        responsesList = responsesList + $("#question-" + (i + 1).toString() + "-2").val() + "#";
        responsesList = responsesList + $("#question-" + (i + 1).toString() + "-3").val() + "#";
    }
    $.ajax({
        type: "POST",
        url: "/create",
        data: JSON.stringify({ name: $("#name-input").val(), theme: themeNumber, questionsNumber: questionsNumber, questions: questionsList, responses: responsesList }),
        contentType: "application/json",

        success: function() {
            loader(false);
            alertBox("Validé", "Votre quiz a été publié.", `
                    <button class="btn btn-sp primary btn-align-right ripple-effect cancel">Fermer</button>`);
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
});