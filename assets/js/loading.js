$("#img-btn").on('click', function() {
    $(".start-button").css('display', 'none');
    $(".container").css('display', 'block');
    redirect();
});

var redirect = function() {
    setTimeout(function() {
        window.location = "index.html";
    }, 3000);
}