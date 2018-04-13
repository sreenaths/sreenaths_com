//--- helpers --------------------------------------------------------------------

function getTestElement(){
	return document.createElement("div");
}

function getMouseEvent( type, target ){

	type = type || "mousedown";
	
	var mousedownEvent = document.createEvent("MouseEvent");
	mousedownEvent.initMouseEvent(type, true, true, window, 0, 10, 10, 10, 10, false, false, false, false, 0, target||null);
	return mousedownEvent;
}

//--------------------------------------------------------------------------------
