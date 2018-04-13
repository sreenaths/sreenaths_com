/*
	Project : bouncing-ball
	PhysicsBase : A container for other physical objects.
*/

(function(){

	// --- Private static constants ---
	var CLASS_ATTRIBUTE = "phyclass";
	var RENDER_INTERVAL = 1000/60;
	var NAME_PREFIX = "Phy"+Math.round(Math.random()*10000);

	// --- Private static functions ---
	function setupChildren( base, baseElement ){

		var children = [];
		var childElements = baseElement.children;

		for( var index=0, length=childElements.length; index<length; index++ ){

			var child = childElements[index];

			var className = child.getAttribute(CLASS_ATTRIBUTE);
			var childClass = Phy.shapes[className];

			if( childClass ) children.push( new childClass( child, base ) );

		}

		return children;

	}

	function preventDef(event){
		event.preventDefault();
	}

	function getChildHash( children ){
		var idHash = {};
		var id, child;
		
		for( var index=0, length=children.length; index<length; index++ ){
			child = children[index].htmlElement;
			id = child.getAttribute("id");
			if( !id ){
				id = (NAME_PREFIX+index);
				child.setAttribute("id",id);
			}
			idHash[id] = children[index];
		}

		return idHash;
	}

	// The Class
	var Phy = function( element ){

		// --- Private variables ---
		var _children = setupChildren( this, element );
		var _childHash = getChildHash( _children );
		var _bounds = { width:element.offsetWidth, height:element.offsetHeight };
		var thisObj = this;

		// --- Init action ---
		if( _.isMobile ){
			_.addListener( element, 'touchmove', preventDef );
		}

		// --- Public functions ---
		this.htmlElement = element;
		this.acceleration = { x:0, y:0 };
		this.friction = 1;

		// --- Private functions ---
		function render( timeFactor ){

			_bounds.width = element.offsetWidth,
			_bounds.height = element.offsetHeight;

			var length = _children.length;
			for( var index = 0; index<length; index++ ) _children[index].lazyMoveInBound( _bounds, timeFactor );

			for (var i = 0; i<length; i++) {
				if( _children[i].visible ){
					var colliders = _children[i].lazyColliders;
					for (var j = i + 1; j<length; j++) if( _children[j].visible ) colliders[ _children[j].name ]( _children[j] );
				}
			}

			for( var index=0; index<length; index++ ) _children[index].draw();

		}

		// --- Public functions ---
		// Start if not running.
		this.start = function(){
			_.enterFrame( render );
		};

		// Stop if running.
		this.stop = function(){
			_.enterFrame(null);
		};

		this.getChildById = function(id){
			return _childHash[id];
		};

		// Destroys this instance
		this.dispose = function(){
			thisObj.stop();
			// Loop through and destroy the children, and destroy public functions
			thisObj.htmlElement =
			thisObj.acceleration =
			thisObj.friction =
			element =
			_children =
			_childHash =
			_timerId = null;
		};

	};
	Phy.shapes={}; // All the shapes must be registered here.
	Phy.controllers={}; // All the shapes must be registered here.

	window.PhysicsBase = 
	window.Phy = Phy;

})();