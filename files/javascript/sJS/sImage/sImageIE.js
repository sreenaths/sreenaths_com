//---- SS Image-IE 1.2 ------------------------------------------------------------------
//     Date : 24-10-2009
//---------------------------------------------------------------------------------------

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
	if( position=="fixed" ) {position="absolute";renderInto=null;}

	var instanceID = sImage.instanceCount;
	var id = "sImage_"+instanceID;
	var span_id = "sImageSpan_"+instanceID;
	
	var img = null;
	var img_span = null;

	var width = null;
	var height = null;
	var hWidth = null;
	var hHeight = null;
	var zoom = 1;
	var opacity = 100;
	var src = "";
	
	this.hide = function(){
		document.getElementById(span_id).style.visibility='hidden';
	}
	this.show = function(){
		document.getElementById(span_id).style.visibility='visible';
	}

	this.getSrc = function( newX ){
		return src;
	}

//	left: expression( ( 20 + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
//	top: expression( ( 10 + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );

	this.setX = function( newX ){
		document.getElementById(span_id).style.left = (newX-hWidth)+"px";
		xPos = newX;
	}
	this.setY = function( newY ){
		document.getElementById(span_id).style.top = (newY-hHeight)+"px";
		yPos = newY;
	}
	this.setPosition = function( newX,newY ){
		img_span = document.getElementById(span_id);
		img_span.style.left = (newX-hWidth)+"px";
		img_span.style.top = (newY-hHeight)+"px";
		xPos = newX;
		yPos = newY;
	}

	this.setWidth = function( newWidth ){
		img = document.images[id];
		width = newWidth;
		newWidth *= zoom; 
		hWidth = newWidth/2;
		document.getElementById(span_id).style.left = (xPos-hWidth)+"px";
		img.style.width = newWidth;
	}
	this.setHeight = function( newHeight ){
		img = document.images[id];
		height = newHeight;
		newHeight *= zoom;
		hHeight = newHeight/2;
		document.getElementById(span_id).style.top = (yPos-hHeight)+"px";
		img.style.height = newHeight;
	}

	this.setOpacity = function(opac){document.getElementById(span_id).style.filter="alpha(opacity="+opac+")";opacity=opac;}

	if(position!="static"&&position!="relative"){
		this.setZoom = function( zo ){
			img_span = document.getElementById(span_id);
			img = document.images[id];
			zoom = zo;
			hWidth = width*zo;
			hHeight = height*zo;
			img.style.width = hWidth;
			img.style.height = hHeight;
			hWidth/=2;
			hHeight/=2;
			img_span.style.left = (xPos-hWidth)+"px";
			img_span.style.top = (yPos-hHeight)+"px";
		}
	}
	else{
		this.setZoom = function( zo ){
			img = document.images[id];
			zoom = zo;
			hWidth = width*zo;
			hHeight = height*zo;
			img.style.width = hWidth;
			img.style.height = hHeight;
			hWidth/=2;
			hHeight/=2;
		}
	}

	this.setZIndex = function(zindex){document.getElementById(span_id).style.zIndex=Math.ceil(zindex);}

	this.onLoad = function(){

		this.onLoad = function(){};

		img = document.images[id];
		img_span = document.getElementById(span_id);

		img.style.height=img.height;
		img.style.width=img.width;
		img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+args.src+"',sizingMethod='scale')";
		img.src=sUtil.vacuous;

		xPos = img_span.left + hWidth;
		yPos = img_span.top + hHeight;

		//To fix a browser bug on initial resize.
		img.width = img.width-1;
		img.height = img.height-1;

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
		return "<span id='"+span_id+"' style='z-index:"+zIndex+";position:"+position+";left:0;top:0;filter:alpha(opacity=100);'  ><img id='"+id+"' src='"+args.src+"' onClick='sImage.iconObjects["+instanceID+"].onClick();'"+dimStr+"></img></span>\n";

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
