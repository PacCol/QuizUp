var section = localStorage.getItem("section");

showSection("explore");

$(".menu .menu-button").click(function () {
    var id = $(this).attr("id");
    if (id !== undefined) {
        showSection(id.split("-button")[0]);
    }
});

function showSection(id) {

    localStorage.setItem("section", id);
    $(".menu .menu-button").removeClass("menu-button-active");
    $("#" + id + "-button").addClass("menu-button-active");
    $(".app > div").fadeOut(100).promise().done(function () {
        $("#" + id).fadeIn(100);
    });
}

function networkError() {
    alertBox("Erreur réseau", "Impossible de se connecter...", `
        <button class="btn btn-sp primary btn-align-right ripple-effect"
        onclick="document.location.reload();">Fermer</button>`);
}