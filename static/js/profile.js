// C'est une fonction qui affiche les boutons "s'inscrire" et "se connecter" permettant à l'utilisateur de se connecter
$("#profile-button").click(function() {
    $("#show-register-button").click(function() {
        showRegister();
    });
    $("#show-login-button").click(function() {
        showLogin();
    });
    getUser();
});

// C'est une fonction qui vérifie les informations de connexion de l'utilisateur et le connecte au serveur si les infos sont bonnes
$("#login-button").click(function() {
    loader(true);
    $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify({ username: $("#username-login").val(), password: $("#password-login").val() }),
        contentType: "application/json",

        success: function(response) {
            loader(false);
            if (response == "success") {
                getUser();
            } else {
                alertBox("Erreur", "Vérifiez votre mot de passe.", `
                    <button class="btn btn-sp primary btn-align-right ripple-effect cancel">Fermer</button>`);
            }
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
});

// C'est une fonction qui envoie au serveur les informations d'enregistrement de l'utilsateur et lui permet de s'inscrire
$("#register-button").click(function() {
    loader(true);
    $.ajax({
        type: "POST",
        url: "/register",
        data: JSON.stringify({ username: $("#username-register").val(), password: $("#password-register").val() }),
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

function getUser() {

    loader(true);
    $.ajax({
        type: "GET",
        url: "/user",

        success: function(response) {
            showLoggedin();
            $("#loggedin p").text("Bonjour " + response + " !");
            loader(false);
        },

        error: function() {
            loader(false);
            showLogin();
        },

        timeout: 3000
    });
}

function showLogin() {
    $("#loggedin").fadeOut(250);
    $("#register").fadeOut(250).promise().done(function() {
        $("#login").fadeIn(250);
    });
}

function showRegister() {
    $("#loggedin").fadeOut(250);
    $("#login").fadeOut(250).promise().done(function() {
        $("#register").fadeIn(250);
    });
}

function showLoggedin() {
    $("#register").fadeOut(250);
    $("#login").fadeOut(250).promise().done(function() {
        $("#loggedin").fadeIn(250);
    });
}

// C'est une fonction qui permet à l'utilsateur de se déconnecter et qui affiche ensuite l'interface de connexion
$("#logout-button").click(function() {
    loader(true);
    $.ajax({
        type: "GET",
        url: "/logout",

        success: function() {
            loader(false);
            showLogin();
        },

        error: function(error) {
            loader(false);
            networkError(error);
        },

        timeout: 3000
    });
});