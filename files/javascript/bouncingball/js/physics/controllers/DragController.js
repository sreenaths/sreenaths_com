/*
	Project : bouncing-ball
	DragController : Controlleg dragging of a shape, and ensures working of the same across all platforms.
	Note : Must be inherited from an abstract controller class in ideal case. Scoping out for the time being.
*/

(function(){

	var DragController = function( shape ){

		// --- Private variables ---
		var _dragStartPos = null;
		var _tmpPos = { x:0, y:0 };
		var _shapeStartPos = null;

		// --- Public variables ---
		this.name = DragController.NAME;

		// --- Private functions ---
		if( _.isMobile ){
			function onTouchDrag( event ){
				var touch = event.touches[0];
				_tmpPos.x = touch.pageX-_dragStartPos.x+_shapeStartPos.x,
				_tmpPos.y = touch.pageY-_dragStartPos.y+_shapeStartPos.y;

				shape.setHookedPos( _tmpPos );
			}

			function startTouchDrag( event ){
				_shapeStartPos = shape.getPos();
				var touch = event.touches[0];
				_dragStartPos = { x: touch.pageX, y: touch.pageY };
				_.addListener( shape.base.htmlElement, "touchmove", onTouchDrag );
				shape.setHookedPos( _shapeStartPos );
			}

			function stopTouchDrag( event ){
				_.removeListener( shape.base.htmlElement, "touchmove", onTouchDrag );
				_dragStartPos = null;
				shape.setHookedPos(null);
			}

			_.addListener( shape.htmlElement, "touchstart", startTouchDrag );
			_.addListener( shape.htmlElement, "touchend", stopTouchDrag );
			_.addListener( shape.base.htmlElement, "touchend", stopTouchDrag );
		}
		else{
			function onMouseDrag( event ){
				if( event.which!=1 ) stopDrag(); // For instances when the mouse move out of the window
				else{
					_tmpPos.x = event.pageX-_dragStartPos.x+_shapeStartPos.x,
					_tmpPos.y = event.pageY-_dragStartPos.y+_shapeStartPos.y;

					shape.setHookedPos( _tmpPos );
				}
			}

			function startDrag( event ){
				_shapeStartPos = shape.getPos();
				_dragStartPos = { x: event.pageX, y: event.pageY };
				_.addListener( shape.base.htmlElement, "mousemove", onMouseDrag );
				shape.setHookedPos( _shapeStartPos );
			}

			function stopDrag( event ){
				_.removeListener( shape.base.htmlElement, "mousemove", onMouseDrag );
				_dragStartPos = null;
				shape.setHookedPos(null);
			}

			_.addListener( shape.htmlElement, "mousedown", startDrag );
			_.addListener( shape.htmlElement, "mouseup", stopDrag );
			_.addListener( shape.base.htmlElement, "mouseup", stopDrag );
		}

		// Destroys this instance
		this.dispose = function(){
			stopDrag();
			_.removeListener( shape.htmlElement, "mousedown", startDrag );
			_.removeListener( shape.htmlElement, "mouseup", stopDrag );
			_.removeListener( shape.base.htmlElement, "mouseup", stopDrag );
			shape =
			_dragStartPos =
			_dragDelta = null;
		};

	};
	DragController.NAME = "DragController";

	Phy.controllers.DragController = DragController;

})();