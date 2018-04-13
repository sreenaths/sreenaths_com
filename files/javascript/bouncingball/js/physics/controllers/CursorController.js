/*
	Project : bouncing-ball
	CursorController : Controlleg dragging of a shape, and ensures working of the same across all platforms.
	Note : Must be inherited from an abstract controller class in ideal case. Scoping out for the time being.
*/

(function(){

	var CursorController = function( shape ){

		// --- Private variables ---
		var _dragPos = null;

		// --- Public variables ---
		this.name = CursorController.NAME;

		// --- Private functions ---
		if( _.isMobile ){
			function onTouchDrag( event ){
				var touch = event.touches[0];
					_dragPos.x = touch.pageX,
					_dragPos.y = touch.pageY;
					shape.setHookedPos( _dragPos );
			}

			function startTouchDrag( event ){
				if( event.target==shape.base.htmlElement ){
					var touch = event.touches[0];
					_dragPos = { x: touch.pageX, y: touch.pageY };
					_.addListener( shape.base.htmlElement, "touchmove", onTouchDrag );
					shape.setPos(_dragPos);
					shape.setHookedPos( _dragPos );
					shape.setVisibility( true );
				}
			}

			function stopTouchDrag( event ){
				_.removeListener( shape.base.htmlElement, "touchmove", onTouchDrag );
				_dragPos = null;
				shape.setVisibility( false );
				shape.setHookedPos(null);
			}

			_.addListener( shape.base.htmlElement, "touchstart", startTouchDrag );
			_.addListener( shape.base.htmlElement, "touchend", stopTouchDrag );
		}
		else{
			function onMouseDrag( event ){
				if( event.which!=1 ) stopDrag(); // For instances when the mouse move out of the window
				else{
					_dragPos.x = event.pageX,
					_dragPos.y = event.pageY;
					shape.setHookedPos( _dragPos );
				}
			}

			function startDrag( event ){
				if( event.target==shape.base.htmlElement ){
					_dragPos = { x: event.pageX, y: event.pageY };
					_.addListener( shape.base.htmlElement, "mousemove", onMouseDrag );
					shape.setPos(_dragPos);
					shape.setHookedPos( _dragPos );
					shape.setVisibility( true );
				}
			}

			function stopDrag( event ){
				_.removeListener( shape.base.htmlElement, "mousemove", onMouseDrag );
				_dragPos = null;
				shape.setVisibility( false );
				shape.setHookedPos(null);
			}

			_.addListener( shape.base.htmlElement, "mousedown", startDrag );
			_.addListener( shape.base.htmlElement, "mouseup", stopDrag );
		}

		// Destroys this instance
		this.dispose = function(){
			stopDrag();
			_.removeListener( shape.base.htmlElement, "mousedown", startDrag );
			_.removeListener( shape.base.htmlElement, "mouseup", stopDrag );
			shape =
			_dragPos = null;
		};

	};
	CursorController.NAME = "CursorController";

	Phy.controllers.CursorController = CursorController;

})();