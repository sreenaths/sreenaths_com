/*
	Project : bouncing-ball
	A generic base for with all the utility code.
*/

(function(){

	var base = function(id){ return document.getElementById(id); };

	var stats = document.createElement("div");
	stats.className += "stats";

	// --- Global constants ---
	base.isIE = window.attachEvent!=null;
	base.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)));

	// --- Global constants ---
	base.enterFrame = (function(){

		var requestID;

		var requestAnimationFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback){
				return window.setTimeout(callback, 1000 / 60);
			};
		var cancelAnimationFrame = window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.clearTimeout;

		function stopLoop(){
			cancelAnimationFrame(requestID);
			requestID=null;
		}

		var prevTime = new Date().getTime();

		return function(callback){
			if( callback ){
				if( requestID ) stopLoop();
				(function animLoop(){
					requestID = requestAnimationFrame(animLoop);
					var time = new Date().getTime();
//					if(Math.random()<0.05) stats.innerHTML = "FPS : "+Math.round( 1000/(new Date().getTime()-prevTime) );
					callback( time-prevTime );
//					if(Math.random()<0.05) stats.innerHTML = "Callback delay : "+( new Date().getTime()-time );
					prevTime = time;
				})();
			}
			else stopLoop();
		};

	})();

	// --- Event listeners ---
	base.addListener = function( element, type, eventListener ){
		if( element.addEventListener ) element.addEventListener( type, eventListener, false );
		else if( element.attachEvent ){

			var IEEventInjectionClosure;
			
			if( type.indexOf("mouse")!=-1 ){
				IEEventInjectionClosure = function(event){ // Fixing IE
					event = event||window.event;
					if( !event.pageX ){
						var body = document.body;
						event.pageX = event.clientX + (event.scrollLeft || body.scrollLeft || 0);
						event.pageY = event.clientY + (event.scrollTop || body.scrollTop || 0);
					}
					event.which = event.button;
					event.target = event.target||event.srcElement;
					eventListener(event);
				};
			}
			else{
				IEEventInjectionClosure = function(event){
					eventListener(event||window.event);
				};
			}

			eventListener._IEEventInjectionClosure = IEEventInjectionClosure;
			
			element.attachEvent( "on" + type, eventListener._IEEventInjectionClosure );	
		}
	};

	base.removeListener = function( element, type, eventListener ){
		if( element.removeEventListener ) element.removeEventListener( type, eventListener, false );
		else if( element.detachEvent ){
			element.detachEvent( "on" + type, eventListener._IEEventInjectionClosure||eventListener ); // Or for cases where the event wasn't attached using addListener.
			eventListener._IEEventInjectionClosure = null;
		}
	};

	base.beep = (function(){

		var AudioContext = window.audioContext || window.webkitAudioContext;

		if( AudioContext ){
			var context = new AudioContext();
			return function(){

				var oscillator = context.createOscillator();
				var vol = context.createGainNode();

				vol.gain.value = 0.02;
				oscillator.connect(vol);
				vol.connect(context.destination);
				oscillator.start(0);

				setTimeout(function(){
					oscillator.stop(0);
					oscillator = null, vol = null;
				}, 30);

			}
		}

		return function(){};

	})();

	base.onLoad = function( listener ){
		function onLoadClosure(event){
			listener(event);
			base.removeListener( window, "load", onLoadClosure);
			listener=null;
		}
		base.addListener( window, "load", onLoadClosure);
	};

	base.onLoad(function(){
		document.body.appendChild( stats );
	});

	window._ = base;

})();