/*
	Project : bouncing-ball
	Circle : Physical 2D representation of the ball.
	Dependency : PhysicsBase.js
	Note : Ideally, most of these functionalities must be in a super class named 'Shape/Object'. Scoping out for the time being.
*/

(function(){

	// -- static constants ---
	var MAX_INTERTIAL_TIME = 80; // Time for becoming stationary

	// Not the best place
	function getPosition( element ){

		var left, top;
		if( window.getComputedStyle ){
			var style = window.getComputedStyle(element);
			left = style.getPropertyValue('left');
			top = style.getPropertyValue('left');
		}
		else{
			left = element.currentStyle.left;
			top = element.currentStyle.top;
		}

		return { x:parseInt(left)||0, y:parseInt(top)||0 };

	}

	var Circle = function( element, base, radius ){

		// --- Private variables ---
		var _controllers = {};
		var _pos = getPosition( element );
		var _hookedPos, _prevHookedPos;
		var _inertialTime=0;
		var _radius = radius || parseInt(element.getAttribute("phyradius")) || element.offsetWidth/2;
		var thisC = this;

		// --- Public variables ---
		this.name = Circle.NAME;
		this.htmlElement = element; // Must be made private
		this.base = base;
		
		this.lazyPosX = 0, this.lazyPosY = 0;
		this.vX=0, this.vY=0;
		this.radius = _radius;
		this.visible = element.style.display!="none";

		this.lazyColliders = {}; // A collection of all colliders

		// --- Private functions ---
		var render = _.isIE ? function(){
			element.style.left = _pos.x,
			element.style.top = _pos.y;
		} : function(){
			element.style.left = _pos.x+"px",
			element.style.top = _pos.y+"px";
		};
		
		// --- Public functions ---
		this.setVisibility = function( val ){
			thisC.visible = val;
			element.style.display = val ? "block": "none";
		};

		this.getPos = function(){ return {x:_pos.x, y:_pos.y}; }; // Cloning position, Hence!

		this.setPos = function(pos){
			if( pos.x!=NaN && pos.y!=NaN ) _pos.x = pos.x, _pos.y = pos.y; // Murphy seal
			render();
		};

		this.setHookedPos = function( pos ){
			_hookedPos = pos			
		};

		this.addController = function( ControllerClass ){
			var controller = new ControllerClass( thisC );
			_controllers[ controller.name ] = controller;
			return controller;
		};

		this.draw = function(){
			if( _pos.x!=thisC.lazyPosX || _pos.y!=thisC.lazyPosY ){
				if( thisC.lazyPosX!=NaN && thisC.lazyPosY!=NaN ){// Murphy seal
					 _pos.x = thisC.lazyPosX, _pos.y = thisC.lazyPosY;
					render();
				}
			}
		};

		// --- Variable Pool for colliders ---
			var dX, dY, hyp;
			var nX, nY;
			var centerX, centerY;
			var vector;
			var tmp;
		// --- Variable Pool for colliders ---

		// --- For circle to circle collision ---
		this.lazyColliders[Circle.NAME] = function( thatC ){
			
			dX = thatC.lazyPosX - thisC.lazyPosX, dY = thatC.lazyPosY - thisC.lazyPosY;
			hyp = Math.sqrt(dX * dX + dY * dY); // Distance between the center positions of circles

			if (hyp < (thatC.radius + _radius)) {

				nX = dX / hyp, nY = dY / hyp; // Collision normal

				centerX = (thisC.lazyPosX + thatC.lazyPosX) * .5; // Point of gravity of collision
				centerY = (thisC.lazyPosY + thatC.lazyPosY) * .5;

				// Rebound the circles
				thisC.lazyPosX = centerX - nX * _radius, thisC.lazyPosY = centerY - nY * _radius;
				thatC.lazyPosX = centerX + nX * thatC.radius, thatC.lazyPosY = centerY + nY * thatC.radius;

				vector = ((thisC.vX - thatC.vX) * nX) + ((thisC.vY - thatC.vY) * nY);
				dX = vector * nX, dY = vector * nY;

				thisC.vX -= dX, thisC.vY -= dY;
				thatC.vX += dX, thatC.vY += dY;

			}

		};

		// Moves the shape based on velocity, do a bound check & rebound if required.
		this.lazyMoveInBound = function( bound, timeFactor ){
			if( _hookedPos ){
				dX = (_hookedPos.x - _pos.x )/timeFactor,
				dY = (_hookedPos.y - _pos.y )/timeFactor;

				if( dX || dY || _inertialTime>MAX_INTERTIAL_TIME ){
					thisC.vX = dX, thisC.vY = dY;
					_inertialTime = 0;
				}
				else _inertialTime += timeFactor;

				thisC.lazyPosX = _hookedPos.x, thisC.lazyPosY = _hookedPos.y;
			}
			else{
				thisC.vX += base.acceleration.x;//*timeFactor, //Yup, time must be used, but not critical, thought il reduce two opeartions.
				thisC.vY += base.acceleration.y;//*timeFactor;

				thisC.vX *= base.friction,
				thisC.vY *= base.friction;

				thisC.lazyPosX = _pos.x + thisC.vX * timeFactor,
				thisC.lazyPosY = _pos.y + thisC.vY * timeFactor;
			}

			if (thisC.lazyPosX < _radius) thisC.lazyPosX = _radius, thisC.vX *= -1;
			else if (thisC.lazyPosX > bound.width-_radius) thisC.lazyPosX = bound.width-_radius, thisC.vX *= -1;

			if (thisC.lazyPosY < _radius) thisC.lazyPosY = _radius, thisC.vY *= -1;
			else if (thisC.lazyPosY > bound.height-_radius) thisC.lazyPosY = bound.height-_radius, thisC.vY *= -1;

		};

		// Destroys this instance
		this.dispose = function(){
			thisC.htmlElement =
			thisC.base =
			element =
			base =
			_controllers = null;
		};

	};
	Circle.NAME = "Shape:Circle";

	Phy.shapes.Circle = Circle;

})();