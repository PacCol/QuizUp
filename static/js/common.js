showSection("explore");

$(".menu .menu-button").click(function() {
    var id = $(this).attr("id");
    if (id !== undefined) {
        showSection(id.split("-button")[0]);
    }
});

// C'est une fonction qui affiche la section selectionnée lorsqu'on clique dessus dans le menu
function showSection(id) {
    $(".menu .menu-button").removeClass("menu-button-active");
    $("#" + id + "-button").addClass("menu-button-active");
    $(".app > div").fadeOut(100).promise().done(function() {
        $("#" + id).fadeIn(100);
    });
}

// C'est une fonction qui retourne une erreur lorsque que l'utilisateur a une erreur réseau
function networkError(error) {
    if (error.status == 401) {
        alertBox("Erreur", "Vous devez vous connecter pour effectuer cette action...", `
        <button class="btn btn-sp primary btn-align-right ripple-effect cancel"
        onclick="showSection('profile');">Fermer</button>`);
    } else {
        alertBox("Erreur réseau", "Impossible de se connecter...", `
        <button class="btn btn-sp primary btn-align-right ripple-effect"
        onclick="document.location.reload();">Fermer</button>`);
    }
}

// C'est une fonction qui retourne en fonction du numéro le thème qui lui est associé
function getThemeFromNumber(nb) {
    if (nb == 1) {
        return ("Français");
    } else if (nb == 2) {
        return ("Maths");
    } else if (nb == 3) {
        return ("Histoire-Géo");
    } else if (nb == 4) {
        return ("Sciences");
    } else if (nb == 5) {
        return ("Culture générale");
    }
}

// C'est une fonction pour rechercher des quizs
$(document).ready(function() {
    $("#search-bar input").keyup(function() {
        let val = $("#search-bar input").val();
        if (val == "") {
            $("#search-list").hide();
            return;
        }

        $.ajax({
            type: "POST",
            url: "/search",
            data: JSON.stringify({ "query": val }),
            contentType: "application/json",

            success: function(response) {
                var results = response;
                $("#search-list").empty();

                $("#search-list").show();

                if (results.length != 0) {

                    for (var i = 0; i < results.length; i++) {
                        $("#search-list").append(`
                            <div class="search-result">
                                <p>${results[i].name}</p>
                                <button class="btn btn-sp btn-sm primary ripple-effect searchbar-btn" onclick="startQuiz(${results[i].id});">Jouer</button>
                            </div>
                        `);
                    }

                } else {
                    $("#search-list").append(`
                            <div class="search-result">
                                <p>Pas de résultat...</p>
                            </div>
                        `);
                }
            },

            error: function(error) {
                loader(false);
                networkError(error);
            },

            timeout: 3000
        });
    });
});