$("#question-number-dropdown .dropdown-content button").click(function () {
    $("#questions").empty();
    $("#question-number-dropdown .btn-badge").text($(this).data("value"));
    for (let i = 0; i < $(this).data("value"); i++) {
        $("#questions").append(`<button class="accordion-tab ripple-effect primary">Question ` + (i+1).toString() + `</button>
                                <div class="panel">
                                    <p>Some text...</p>
                                </div>`);
    }
});

$("#publish-button").click(function() {
    loader(true);
    var questionsList = "Ca va?#WESH";
    var responsesList = "GG#GG#GG#GG#GH#VB#VB#DF";
    $.ajax({
        type: "POST",
        url: "/create",
        data: JSON.stringify({ name: $("#name-input").val(), theme: $("#theme-input").val(), questions: questionsList, responses: responsesList}),
        contentType: "application/json",

        success: function() {
            loader(false);
            alertBox("Validé", "Vous pouvez vous connecter.", `
                    <button class="btn btn-sp primary btn-align-right ripple-effect cancel">Fermer</button>`);
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
});