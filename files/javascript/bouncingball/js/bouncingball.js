/*
	Project : bouncing-ball
	Bouncing Ball specific code.
*/

_.onLoad(function(){

	// Setup the UI
	var phy = new PhysicsBase(_("base"));

	var ball = phy.getChildById("ball");
	ball.addController( Phy.controllers.DragController );
	ball.setPos({x:phy.htmlElement.offsetWidth/2, y:phy.htmlElement.offsetHeight/2});

	var rotor = phy.getChildById("rotor");
	rotor.addController( Phy.controllers.CursorController );
	rotor.setVisibility( false );

	var gravitySlider = _("gravitySlider");
	var frictionSlider = _("frictionSlider");

	function getVal( element ){
		var val = parseFloat( element.value );
		return val ? val : 0;
	}

	_.addListener( gravitySlider, "change", function(){
		phy.acceleration.y = getVal(gravitySlider);
	});
	_.addListener( frictionSlider, "change", function(){
		phy.friction = 1-getVal(frictionSlider)*.2;
	});

	phy.start();

});