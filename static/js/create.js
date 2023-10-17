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