/*
	Project : bouncing-ball
	UTs for bouncing ball related classes
*/

//--- Fixture --------------------------------------------------------------------

var circle;

//--- base.js --------------------------------------------------------------------
var dragController;
var cursorController;

module ("Controllers", {
	setup: function(){

		circle = {
			pos: { x: 0, y:0 },
			visible: true,
			hpos: null,
			base: {
				htmlElement: getTestElement()
			},
			htmlElement: getTestElement(),
			setVisibility: function(vis){ circle.visible=vis; },
			setHookedPos: function( pos ){ circle.hpos=pos; },
			setPos: function( pos ){ circle.pos.x=pos.x, circle.pos.y=pos.y; },
			getPos: function( pos ){ return circle.pos; }
		};
	}
});

test( "Check for initialization", function() {

	dragController = new Phy.controllers.DragController( circle );
	cursorController = new Phy.controllers.CursorController( circle );
	
	ok( Phy.controllers.CursorController, "Creatoin test" );
	ok( Phy.controllers.CursorController.NAME, "Creatoin test" );
	equal( cursorController.name, Phy.controllers.CursorController.NAME, "Initiation test" );

	ok( Phy.controllers.DragController, "Creatoin test" );
	ok( Phy.controllers.DragController.NAME, "Creatoin test" );
	equal( dragController.name, Phy.controllers.DragController.NAME, "Initiation test" );
	
	dragController.dispose();
	cursorController.dispose();
});

test( "Check for Drag Controller functionality", function() {

	if( _.isMobile || _.isIE ){ // Scoping out for the time being
		ok(true);
		return;
	}

	dragController = new Phy.controllers.DragController( circle );

	var mouseEvent;

	// No Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 20, 30, 20, 30, false, false, false, false, 0, null);
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "No Dragging" );

	// Start Drag
	mouseEvent = getMouseEvent();
	circle.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos.x, circle.pos.x, "Start Drag" );
	equal( circle.hpos.y, circle.pos.y, "Start Drag" );
	equal( circle.pos.x, 0, "Start Drag" );
	equal( circle.pos.y, 0, "Start Drag" );

	// Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 20, 30, 20, 30, false, false, false, false, 0, null);
	mouseEvent.pageX = 20, mouseEvent.pageY = 30;
	mouseEvent.which=1;
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos.x, 10, "Dragging test" );
	equal( circle.hpos.y, 20, "Dragging test" );

	// Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 20, 30, 30, 40, false, false, false, false, 0, null);
	mouseEvent.which=0;
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos.x, 20, "Dragging test" );
	equal( circle.hpos.y, 30, "Dragging test" );

	// Stop Drag
	mouseEvent = getMouseEvent("mouseup");
	circle.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "Stop Drag test" );

	// No Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 30, 40, 30, 40, false, false, false, false, 0, null);
	mouseEvent.which=1;
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "No Dragging test" );

	dragController.dispose();
});

test( "Check for Cursor Controller functionality", function() {

	if( _.isMobile || _.isIE ){ // Scoping out for the time being
		ok(true);
		return;
	}

	cursorController = new Phy.controllers.CursorController( circle );

	var mouseEvent;

	// No Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 20, 30, 20, 30, false, false, false, false, 0, null);
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "No Dragging test" );
	equal( circle.pos.x, 0, "No Dragging test" );
	equal( circle.pos.y, 0, "No Dragging test" );

	// No Drag
	mouseEvent = getMouseEvent();
	circle.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "No Dragging test" );
	equal( circle.pos.x, 0, "No Dragging test" );
	equal( circle.pos.y, 0, "InitiNo Draggingation test" );

	// Start Drag
	mouseEvent = getMouseEvent();
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos.x, 10, "Start Drag test" );
	equal( circle.hpos.y, 10, "Start Drag test" );
	equal( circle.pos.x, 10, "Start Drag test" );
	equal( circle.pos.y, 10, "Start Drag test" );

	// Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 20, 30, 20, 30, false, false, false, false, 0, null);
	mouseEvent.which=1;
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos.x, 20, "Dragging test" );
	equal( circle.hpos.y, 30, "Dragging test" );

	// Stop Drag
	mouseEvent = getMouseEvent("mouseup");
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "Stop Drag test" );

	// No Dragging
	mouseEvent = getMouseEvent();
	mouseEvent.initMouseEvent("mousemove", true, true, window, 0, 30, 40, 30, 40, false, false, false, false, 0, null);
	mouseEvent.which=1;
	circle.base.htmlElement.dispatchEvent( mouseEvent );
	equal( circle.hpos, null, "No Drag test" );

	cursorController.dispose();
});