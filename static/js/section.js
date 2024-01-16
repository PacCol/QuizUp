showSection("explore");

$(".menu .menu-button").click(function() {
    var id = $(this).attr("id");
    if (id !== undefined) {
        showSection(id.split("-button")[0]);
    }
});

function showSection(id) {
    $(".menu .menu-button").removeClass("menu-button-active");
    $("#" + id + "-button").addClass("menu-button-active");
    $(".app > div").fadeOut(100).promise().done(function() {
        $("#" + id).fadeIn(100);
    });
}

function networkError(error) {
    console.log(error);
    alertBox("Erreur réseau", "Impossible de se connecter...", `
        <button class="btn btn-sp primary btn-align-right ripple-effect"
        onclick="document.location.reload();">Fermer</button>`);
}

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