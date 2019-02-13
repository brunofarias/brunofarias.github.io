var home = {
	init: function(){
		this.scroll();
		this.waypoint();
	},
	scroll: function() {

		$('a[href^="#"]').on('click', function(event) {
			var target = $(this.getAttribute('href'));
	    if( target.length ) {
        event.preventDefault();
        $('html, body').stop().animate({
          scrollTop: target.offset().top
        }, 1000);
	    }
		});
	},

	waypoint: function () {

		$('.view').waypoint(function(){
			$(this).addClass('scroll');
		},{offset:'65%'});

	}
}
home.init();

new AnimOnScroll( document.getElementById( 'grid' ), {
  minDuration : 0.4,
  maxDuration : 0.7,
  viewportFactor : 0.2
});

// svg
svg4everybody();

