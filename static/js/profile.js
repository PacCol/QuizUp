$("#profile-button").click(function() {
    $("#show-register-button").click(function() {
        $("#login").fadeOut(250).promise().done(function () {
            $("#register").fadeIn(250);
        });
    });
    $("#show-login-button").click(function() {
        $("#register").fadeOut(250).promise().done(function () {
            $("#login").fadeIn(250);
        });
    });
    $("#login-button").click(function() {
        loader(true);
        $.ajax({
            type: "POST",
            url: "/login",
            data: JSON.stringify({username: $("#username-login").val(), password: $("#password-login").val()}),
            contentType: "application/json",
    
            success: function() {
                loader(false);
            },
    
            error: function() {
                loader(false);
                networkError();
            },
    
            timeout: 3000
        });
    });
    $("#register-button").click(function() {
        loader(true);
        //alert($("#username-register").val());
        $.ajax({
            type: "POST",
            url: "/register",
            data: JSON.stringify({username: $("#username-register").val(), password: $("#password-register").val()}),
            contentType: "application/json",
    
            success: function() {
                loader(false);
            },
    
            error: function() {
                loader(false);
                networkError();
            },
    
            timeout: 3000
        });
    });
});