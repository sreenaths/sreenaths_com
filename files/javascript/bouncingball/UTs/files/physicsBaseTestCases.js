/*
	Project : bouncing-ball
	UTs for bouncing ball related classes
*/

//--- Fixtures ------------------------------------------------------------------------
var dummyCircle1;
var dummyCircle2;
var baseBounds;

var colliderCalledFor;
var colliderCalledWith;
var colliderCallCount = 0;

var drawCallCount = 0;

var Circle = function( element ){

	var thisC = this;

	this.htmlElement = element;
	this.lazyMoveInBound = function(bounds){
		baseBounds = bounds;
	}
	this.draw = function(){
		drawCallCount++;
	};
	this.visible = true;
	this.name = Circle.NAME;

	this.lazyColliders = {};
	this.lazyColliders[Circle.NAME] = function(circle){
		colliderCallCount++;
		colliderCalledFor = thisC;
		colliderCalledWith = circle;
	};

	if( element==_("dummy1") ) dummyCircle1 = this;
	if( element==_("dummy2") ) dummyCircle2 = this;

};
Circle.NAME = "Circle";
Phy.shapes.Circle = Circle;

//--- Physics Base --------------------------------------------------------------------
var phy;
var base;

module ("Physics Base", {
	setup: function(){
		base = _("base");
		phy = new PhysicsBase(base);
	}
});
test( "Check initialization", function() {

	// Check static properties	
	ok( Phy, "Class creation" );
	ok( PhysicsBase, "Class creation" );
	ok( Phy.shapes, "Hash for all the supported shapes" );
	ok( Phy.controllers, "Hash for all the supported controllers" );

	// Check public properties
	ok( phy, "Base instance was created" );
	ok( phy.acceleration, "Property check" );
	ok( phy.friction, "Property check" );

	// Check public function
	ok( phy.start, "Start function check" );
	ok( phy.stop, "Stop function check" );
	ok( phy.getChildById, "Get child function check" );
	ok( phy.dispose, "dispose function check" );

});

test( "Check functionalities", function() {

	colliderCallCount = 0;
	drawCallCount = 0;

	equal( phy.getChildById("dummy1"), dummyCircle1, "Children extraction" );
	equal( phy.getChildById("dummy2"), dummyCircle2, "Children extraction" );
	equal( phy.getChildById("dummy3"), undefined, "Children extraction" );

	phy.start();

	notEqual( baseBounds, undefined, "Lazy move call" )
	equal( baseBounds.width, base.offsetWidth, "Lazy move call" )
	equal( baseBounds.height, base.offsetHeight, "Lazy move call" )

	equal( colliderCalledFor, dummyCircle1, "Collider called for" );
	equal( colliderCalledWith, dummyCircle2, "Collider called with" );
	equal( colliderCallCount, 1, "Collider call check");

	equal( drawCallCount, 2, "Draw call check");

	phy.dispose();
	equal( phy.htmlElement, null, "Dispose check");
	equal( phy.acceleration, null, "Property check" );
	equal( phy.friction, null, "Property check" );
	throws( function(){ phy.getChildById("dummy1") }, "Child hash deletion" );

});

asyncTest( "Test Start", function(){

	drawCallCount = 0;
	phy.start();
	setTimeout(function(){

		notEqual( drawCallCount, 0, "	Start check" );
		var stopDrawCount = drawCallCount;
		phy.stop();

		setTimeout(function(){
			equal( drawCallCount, stopDrawCount, "Stop check" );
			start();
		},100);

	},100);

});