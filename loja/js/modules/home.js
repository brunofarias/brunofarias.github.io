$( document ).ready(function() {
  $('.featured__slider').addClass('show');
});

var home = {
	init: function(){
    this.slider();
	},

  slider: function() {
    $('.featured .owl-carousel').owlCarousel({
      autoplay: true,
      autoplayTimeout: 10000,
      autoplaySpeed: 2000,
      items:1,
      loop: true,
      nav: false,
      dots: false
    })
  },
}
home.init();

