//---- SS Image Default 1.2 -----------------------------------------------------
//     Date : 24-10-2009
//-----------------------------------------------------------------------------------

if(!window.sUtil) sJS.include("sImageBase");

function sImage( args ){

	this.Super = sImageBase;
	this.Super( args );

	this.getX = function(){return xPos;}
	this.getY = function(){return yPos;}

	this.getWidth = function(){return width;}
	this.getHeight = function(){return height;}
	this.getHWidth = function(){return hWidth;}
	this.getHHeight = function(){return hHeight;}

	this.getZoom = function(){return zoom;}
	this.getOpacity = function(){return opacity;}

	this.getImageWidth = function(){return document.images[id].width;}
	this.getImageHeight = function(){return document.images[id].height;}

	var dimStr="";
	if( args.width ) dimStr+=" width='"+args.width+"' ";
	if( args.height ) dimStr+=" height='"+args.height+"' ";

	var zIndex=0;
	var position="fixed";
	var renderInto=null;
	if( args.position!=null ) position=args.position;
	if( args.renderInto!=null ) renderInto=args.renderInto;
	if( args.zIndex!=null ) zIndex=args.zIndex;
	else if ( renderInto!=null && position!="static" ) zIndex=sUtil.getNextZindex(renderInto);
	else if ( position!="static" ) zIndex=sUtil.getNextZindex();
	
	var instanceID = sImage.instanceCount;
	var id = "sImage_"+instanceID;

	var img = null;

	var width = null;
	var height = null;
	var hWidth = null;
	var hHeight = null;
	var zoom = 1;
	var opacity = 100;
	var src = "";

	this.hide = function(){
		document.images[id].style.visibility='hidden';
	}
	this.show = function(){
		document.images[id].style.visibility='visible';
	}

	this.getSrc = function( newX ){
		return src;
	}

	this.setX = function( newX ){
		document.images[id].style.left = (newX-hWidth)+"px";
		xPos = newX;
	}
	this.setY = function( newY ){
		document.images[id].style.top = (newY-hHeight)+"px";
		yPos = newY;
	}
	this.setPosition = function( newX,newY ){
		img = document.images[id];
		img.style.left = (newX-hWidth)+"px";
		img.style.top = (newY-hHeight)+"px";
		xPos = newX;
		yPos = newY;
	}

	this.setWidth = function( newWidth ){
		img = document.images[id];
		width = newWidth;
		newWidth *= zoom; 
		hWidth = newWidth/2;
		img.style.left = (xPos-hWidth)+"px";
		img.width = newWidth;
	}
	this.setHeight = function( newHeight ){
		img = document.images[id];
		height = newHeight;
		newHeight *= zoom;
		hHeight = newHeight/2;
		img.style.top = (yPos-hHeight)+"px";
		img.height = newHeight;
	}

	this.setOpacity = function(opac){document.images[id].style.opacity=opac/100;opacity=opac;}

	this.setZoom = function( zo ){
		img = document.images[id];
		zoom = zo;
		img.width=width*zo;
		img.height = height*zo;
		hWidth = img.width/2;
		hHeight = img.height/2;
		img.style.left = (xPos-hWidth)+"px";
		img.style.top = (yPos-hHeight)+"px";
	}
	
	this.setZIndex = function(zindex){document.images[id].style.zIndex=Math.ceil(zindex);}

	this.onLoad = function(){

		this.onLoad = function(){};

		img = document.images[id];

		//To fix a browser bug on initial resize.
		img.width = img.width-1;
		img.height = img.height-1;
		img.width = img.width+1;
		img.height = img.height+1;

		xPos = img.left + hWidth;
		yPos = img.top + hHeight;

		width = img.width;
		height = img.height;
		hWidth = img.width/2;
		hHeight = img.height/2;

		if( args.x!=null ) this.setX(args.x);
		if( args.y!=null ) this.setY(args.y);
		if( args.zoom!=null ) this.setZoom(args.zoom);
		if( args.opacity!=null ) this.setOpacity(args.opacity);
		if( args.src ) src=args.src;

		if( !args.hidden ) this.show();
	}

	this.renderHere = function(){
		this.renderHere = function(){};
		return "<img id='"+id+"' src='"+args.src+"' style='z-index:"+zIndex+";position:"+position+";left:0;top:0;opacity:1;' onClick='sImage.iconObjects["+instanceID+"].onClick();' onLoad='sImage.iconObjects["+instanceID+"].onLoad(this);'"+dimStr+"></img>\n";
	}

	if( args.render!=false ){
		if( renderInto!=null )
			document.getElementById(renderInto).innerHTML+=this.renderHere();
		else
			this.iShack.innerHTML+=this.renderHere();
		this.onLoad();
	}

	sImage.iconObjects[instanceID]=this;
	sImage.instanceCount++;
};

if( !sImage.iconObjects ) sImage.iconObjects = new Array();
if( !sImage.instanceCount ) sImage.instanceCount=0;
if( !sImage.prototype.iShack ) sImage.prototype.iShack = null;
