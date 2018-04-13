/*
	Project : bouncing-ball
	UTs for bouncing ball related classes
*/

//--- Fixtures ------------------------------------------------------------------------
var base;

//--- base.js --------------------------------------------------------------------
var html;
var circle;

module ("Circle", {
	setup: function(){

		base = {
			acceleration:{ x:0, y:0 },
			friction: 1
		};

		html = _("dummy");
		circle = new Phy.shapes.Circle( html, base, 10 );
		circle.vX = 0, circle.vY = 0;

	}
});

test( "Check for initialization", function() {

	// Static consts
	ok( Phy.shapes.Circle , "Class creation" );
	ok( Phy.shapes.Circle.NAME , "Class creation" );

	// Instance properties
	ok( circle , "Instance creation" );
	equal( circle.name, Phy.shapes.Circle.NAME , "Instance creation" );
	equal( circle.base, base , "Instance creation" );
	
	notEqual( circle.lazyPosX, undefined , "Instance creation" );
	notEqual( circle.lazyPosY, undefined , "Instance creation" );
	notEqual( circle.vX, undefined , "Instance creation" );
	notEqual( circle.vY, undefined , "Instance creation" );
	notEqual( circle.radius, undefined , "Instance creation" );
	notEqual( circle.visible, undefined , "Instance creation" );
	notEqual( circle.lazyColliders, undefined , "Instance creation" );
	equal( circle.radius, 10 , "Instance creation" );

});

test( "Check for base functionality", function() {

	// Visibility
	ok( circle.setVisibility , "Visibility function" );
	equal( circle.visible , true, "Visibility check" );
	circle.setVisibility(false);
	equal( circle.visible , false, "Visibility check" );
	equal( html.style.display , 'none', "Visibility check" );
	circle.setVisibility(true);
	equal( circle.visible , true, "Visibility check" );
	equal( html.style.display , 'block', "Visibility check" );

	// Set,get pos
	var position = { x: 100, y:200 };
	ok( circle.setPos , "setPos function" );
	circle.setPos({x:1,y:1});
	circle.setPos(position);
//	equal( parseInt(html.style.left) , position.x, "setPos check X" );
//	equal( parseInt(html.style.top) , position.y, "setPos check Y" );
	equal( circle.getPos().x , position.x, "getPos check X" );
	equal( circle.getPos().y , position.y, "getPos check Y" );

	// Add controller
	function Controller(){}
	ok(circle.addController, "Add controller check");
	ok(circle.addController(Controller), "Add controller check");
	throws(function(){circle.addController(1);}, "Add controller check");
	equal( Controller, circle.addController(Controller).constructor, "Controller instantiation check" )

	// Dispose
	circle.dispose();
	equal( circle.base, null, "Dispose check" );

});

test( "Test draw", function() {

	ok(circle.draw, "Draw check");
	circle.lazyPosX = 100, circle.lazyPosY = 200; 
	circle.setPos({x:1,y:1});
	circle.draw();
//	equal( parseInt(html.style.left) , circle.lazyPosX, "draw check X" );
//	equal( parseInt(html.style.top) , circle.lazyPosY, "draw check Y" );
	circle.lazyPosX = NaN, circle.lazyPosY = NaN; 
	equal( circle.getPos().x , 100, "draw check X" );
	equal( circle.getPos().y , 200, "draw check Y" );

});

test( "Test hooked lazy move", function() {

	ok(circle.lazyMoveInBound, "Move check");
	ok(circle.setHookedPos, "Hooked move check");

	// Hooked move check
	var hookedPos = { x:300, y:100 };
	circle.setHookedPos(hookedPos);
	circle.lazyMoveInBound({ width:600, height:400 });
	equal( circle.lazyPosX , 300, "Hooked position check X" );
	equal( circle.lazyPosY , 100, "Hooked pos check Y" );

	// Bottom right bounding 
	circle.lazyMoveInBound({ width:hookedPos.x, height:hookedPos.y });
	equal( circle.lazyPosX , hookedPos.x-circle.radius, "Hooked position check X" );
	equal( circle.lazyPosY , hookedPos.y-circle.radius, "Hooked pos check Y" );

	// Top left bounding 
	var hookedPos = { x:circle.radius-5, y:circle.radius-8 };
	circle.setHookedPos(hookedPos);
	circle.lazyMoveInBound({ width:600, height:400 });
	equal( circle.lazyPosX , circle.radius, "Hooked position check X" );
	equal( circle.lazyPosY , circle.radius, "Hooked pos check Y" );

	circle.draw();

	// Velocity check 
	var hookedPos = { x:circle.radius+10, y:circle.radius+10 };
	circle.setHookedPos(hookedPos);
	circle.lazyMoveInBound({ width:600, height:400 },1);
	equal( circle.vX , 10, "Hooked position check X" );
	equal( circle.vY , 10, "Hooked pos check Y" );


});

test( "Test lazy move", function() {

	circle.setHookedPos(null);

	// Lazy move check
	var pos = { x:100, y:200 };
	circle.setPos(pos);
	circle.vX = 5, circle.vY = 8;
	circle.lazyMoveInBound({ width:600, height:400 },1);
	equal( circle.lazyPosX , pos.x+5, "Lazy position check X" );
	equal( circle.lazyPosY , pos.y+8, "Lazy position check Y" );

	// Bottom right bounding 
	var bound = { width: 600, height: 400 };
	circle.setPos({ x:bound.width-circle.radius-5, y:bound.height-circle.radius-8 });
	circle.vX = 10, circle.vY = 10;
	circle.lazyMoveInBound(bound,1);
	equal( circle.lazyPosX , bound.width-circle.radius, "Bottom right Lazy rebounding check X" );
	equal( circle.lazyPosY , bound.height-circle.radius, "Bottom right Lazy rebounding check Y" );

	// Top left bounding 
	circle.setPos({ x:circle.radius+5, y:circle.radius+8 });
	circle.vX = -10, circle.vY = -10;
	circle.lazyMoveInBound(bound,1);
	equal( circle.lazyPosX , circle.radius, "Top left Lazy rebounding check X" );
	equal( circle.lazyPosY , circle.radius, "Top left Lazy rebounding check Y" );

	circle.draw();

	// Velocity change check 
	circle.vX = 11, circle.vY = 22;
	circle.lazyMoveInBound({ width:600, height:400 },1);
	equal( circle.vX , 11, "Velocity change check X" );
	equal( circle.vY , 22, "Velocity change check Y" );

	// For acceleration
	base.acceleration.x = 2, base.acceleration.y = 5;
	circle.vX = 11, circle.vY = 22;
	circle.lazyMoveInBound({ width:600, height:400 },1);
	equal( circle.vX , 11+2*1, "Velocity change check X" ); // Tiem part is commented in code
	equal( circle.vY , 22+5*1, "Velocity change check Y" );

	// For friction
	base.acceleration.x = 0, base.acceleration.y = 0;
	base.friction = .5;
	circle.vX = 11, circle.vY = 22;
	circle.lazyMoveInBound({ width:600, height:400 },1);
	equal( circle.vX , 11*.5, "Velocity change check X" ); // Time part is commented in code
	equal( circle.vY , 22*.5, "Velocity change check Y" );

});

test( "Test collider", function() {

	circle.lazyPosX = 100, circle.lazyPosY = 100;
	var ccCollider = circle.lazyColliders[ Phy.shapes.Circle.NAME ];

	var anotherCircle = new Phy.shapes.Circle(_("dummy1"), base, 10);
	anotherCircle.lazyPosX = 120, anotherCircle.lazyPosY = 100;

	ccCollider( anotherCircle );

	//No colission
	equal( circle.lazyPosX , 100, "Position change check X" );
	equal( circle.lazyPosY , 100, "Position change check Y" );
	equal( anotherCircle.lazyPosX , 120, "Position change check X" );
	equal( anotherCircle.lazyPosY , 100, "Position change check Y" );

	//Colission
	anotherCircle.lazyPosX = 110, anotherCircle.lazyPosY = 100;
	ccCollider( anotherCircle );
	equal( circle.lazyPosX , 95, "Position change check X" );
	equal( circle.lazyPosY , 100, "Position change check Y" );
	equal( anotherCircle.lazyPosX , 115, "Position change check X" );
	equal( anotherCircle.lazyPosY , 100, "Position change check Y" );

});
