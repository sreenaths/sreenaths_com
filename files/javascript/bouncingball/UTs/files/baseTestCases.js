/*
	Project : bouncing-ball
	UTs for bouncing ball related classes
*/

//--- base.js --------------------------------------------------------------------
module ("base.js");
test( "Check for initialization", function() {
	
	ok( _, "Base was created" );
	
	notEqual( _.isIE, undefined, "Browser check done" );
	notEqual( _.isMobile, undefined, "Platform check done" );
	notEqual( _.enterFrame, undefined, "Animation frame manager created" );
	notEqual( _.addListener, undefined, "Listener handler added" );
	notEqual( _.removeListener, undefined, "Listener removed added" );
	notEqual( _.onLoad, undefined, "Listener handler added" );

});

test( "Functionality check", function() {

	// Check _ functionality
	equal( _("qunit"), document.getElementById("qunit"), "GetElementById short hand is working" );

	// Check event manager functions
	var element = getTestElement();
	var testEvent1 = getMouseEvent();
	var testEvent2 = getMouseEvent();
	var firedEvent;

	function listener( event ){
		firedEvent=event;
	}

	_.addListener( element, "mousedown", listener );
	element.dispatchEvent( testEvent1 );
	equal( firedEvent, testEvent1, "Add Listener check 1" );

	_.addListener( element, "mousedown", listener );
	element.dispatchEvent( testEvent2 );
	equal( firedEvent, testEvent2, "Add Listener check 2" );

	_.removeListener( element, "mousedown", listener );
	element.dispatchEvent( testEvent1 );
	notEqual( firedEvent, testEvent1, "Remove Listener check" );

	// Event manager, special check for IE fixes
	notEqual( firedEvent.pageX, undefined, "Position fix check" );
	notEqual( firedEvent.pageY, undefined, "Position fix check" );
	notEqual( firedEvent.which, undefined, "Button fix check" );
	notStrictEqual( firedEvent.target, undefined, "Target fix check" );

});

asyncTest( "Testing animation loop", function() {

	var loopCount = 0;
	var MAX_COUNT = 4;
	var timeDelta; 
	var previousTime, currentTime;

	_.enterFrame( function(delta){

		timeDelta = delta;
		previousTime = currentTime;
		currentTime = new Date().getTime();

		loopCount++;
		if( loopCount==MAX_COUNT ) _.enterFrame(null);

	} );

	setTimeout(function(){
		notEqual( loopCount, 0, "Animation loop attachment check" );
		equal( loopCount, MAX_COUNT, "Animation loop detachment check" );
		equal( timeDelta, currentTime-previousTime, "Time delta check, a small deviation because of overhead is also accepted" );
		start();
	},500);

});