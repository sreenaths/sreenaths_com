/* --- Parallax for sreenaths.com --- */

function initiateImgParallax( container ){

	var PARALAX_DURATION = 50;

	var images = container.find('div');

	if( isMobile() ) return;

	// -- Set items to the expected conf if js is enabled ---
	images.each( function( index, image ){

		image = $(image);

		var left = parseInt(image.attr("x"));
		image.attr("x",parseInt(image.css("left")) + (index+1) * 5 );
		image.css("left",left);

	});
	container.css("visibility","hidden");
	// -----------------------------------------------------

	function animateParalax(mX, duration, easing){
		var xPos = mX-container.offset().left;
		var mouseXFactor = Math.round(xPos / container.width() * 10);

		images.each( function( index, image ){

			image = $(image);

			var x = parseInt(image.attr("x"));
			x -= (index+1)*mouseXFactor;

			image.stop();
			image.animate({left: x},{duration: duration, easing: easing, queue: false});

		});
	}

	if( !isMobile() ){
		container.mousemove(function(e){
			animateParalax(e.pageX,PARALAX_DURATION,'linear');
		});
		container.mouseout(function(){
			animateParalax(container.width()/2,PARALAX_DURATION,"linear");
		});
	}

	$(window).load(function(){
		setTimeout(function(){
			container.css("visibility","visible");
			animateParalax(container.width()/2,500,"swing");
			container.fadeIn();
		},550 );
	});
}

initiateImgParallax($(".paralax-container"));


function onResize() {
	var width = $(window).width();
	if(width < 1024) {
		$(".paralax-container").css("zoom", width / 1024);
	}
}
$(window).resize(onResize);
onResize();
