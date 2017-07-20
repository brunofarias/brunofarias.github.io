$(document).ready(function() {        
    $('#nav-home').click(function() {
          $('html,body').animate({scrollTop: $('#home').offset().top}, 2000);
        });
    $('#nav-portfolio').click(function() {
          $('html,body').animate({scrollTop: $('#portfolio').offset().top}, 2000);
        });
    $('#nav-sobre').click(function() {
          $('html,body').animate({scrollTop: $('#sobre').offset().top -30}, 2000);
        });
    $('#nav-contato').click(function() {
          $('html,body').animate({scrollTop: $('#contato').offset().top}, 2000);
        });
})