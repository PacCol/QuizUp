$("#progression-button").click(function() {
    loadProgression();
});

function loadProgression() {
    loader(true);
    $.ajax({
        type: "GET",
        url: "/progress",
        contentType: "application/json",

        success: function(response) {
            if (response.rightAnswers == 0 && response.falseAnswers == 0) {
                loader(false);
                alertBox("Erreur", "Vous devez terminer au moins un quiz avant de consulter vos résultats.", `
                        <button class="btn btn-sp primary btn-align-right ripple-effect cancel"
                        onclick="showSection('explore');">Fermer</button>`);
            } else {
                let total = response.rightAnswers + response.falseAnswers;
                $("#total-responses-nb").text("Nombre total de questions réalisées: " + total);
                let rightAnswers = Math.round(response.rightAnswers * 100 / total);
                setTimeout(function() {
                    createDiagram("#diagram", ["Bonnes réponses", "Mauvaise réponses"], ["success", "danger"], [rightAnswers, 100 - rightAnswers]);
                    loader(false);
                }, 300);
            }
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
}