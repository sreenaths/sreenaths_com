// JavaScript Document

//---- SS Dock 1.0 ------------------------------------------------------------------
//  Date : 24-10-2009
//-----------------------------------------------------------------------------------

if(!window.sImage) sJS.include("sImage");

function sDock(args){

	sDock.classInit();
	var iconArray = new Array();
	var i=0,iconSpacing=30,mouseRange=100,mouseRange2=10000,backZ=30,mFactor=0.5,explosion='zoom',status=0;
	var xPrim = new Array();
	var yPrim = new Array();
	var xTmp = new Array();
	var yTmp = new Array();
	var zTmp = new Array();
	
	var scrollXB = 0;
	var scrollYB = 0;
	
	var docX=0;
	var docY=0;
	var h=0;

	var bCenterX=0;
	var bCenterY=0;
	
	var dockID = sDock.sDObjects.length;
	
	var renderOff=false;
	
	var temp1,temp2,temp3,tempb;

	if( args.iconSpacing!=null ) iconSpacing=args.iconSpacing;
	if( args.mouseRange!=null ) { mouseRange=args.mouseRange; mouseRange2=mouseRange*mouseRange; }
	if( args.backZ!=null ) { backZ=args.backZ; }
	if( args.mFactor!=null ) { mFactor=args.mFactor; }
	if( args.explosion!=null ){ explosion=args.explosion; }
	
	mFactor=mouseRange/mFactor;
	
	this.onClick = function(handl){
		sDock.sDObjects[dockID].explode(handl);
	}

	for( i=0;i<args.icons.length;i++ ){
		args.icons[i].x=this.winWidth/2;
		args.icons[i].y=this.winWidth/2;
		args.icons[i].zoom=backZ/mFactor;
		args.icons[i].parent=this;
		args.icons[i].parentHandler=this.onClick;
		iconArray[i] = new sImage(args.icons[i]);
	}

	this.reAlign = function(){
		
		docX=this.winWidth/2;
		docY=this.winHeight/2;
		if( iconArray.length==0 ) return;

		var totalWidth=0;
		xTmp[0]=iconArray[0].getHWidth();
		totalWidth+=iconArray[0].getImageWidth();
		for( i=1;i<iconArray.length;i++ ){
			totalWidth+=iconSpacing;
			xTmp[i]=totalWidth+iconArray[i].getHWidth();
			totalWidth+=iconArray[i].getImageWidth();
		}
		totalWidth/=2;
		for( i=0;i<iconArray.length;i++ ){
			xPrim[i]=xTmp[i]-totalWidth+docX;
			yPrim[i]=docY;
		}
	}

	this.scrollDock = function(){
		var scrOffX=scrollXB-this.winScrlOffX;
		var scrOffY=scrollYB-this.winScrlOffY;
		docX+=scrOffX;
		docY+=scrOffY;
		for( i=0;i<iconArray.length;i++ ){
			xPrim[i]=xPrim[i]+scrOffX;
			yPrim[i]=yPrim[i]+scrOffY;
		}
		scrollXB=this.winScrlOffX;
		scrollYB=this.winScrlOffY;
	}
	
	this.render = function(forcedRender){
		if( renderOff )return;

		temp1=false;
		for( i=0;i<xPrim.length;i++){
			temp2=xPrim[i]-this.mouseX;
			temp3=yPrim[i]-this.mouseY;
			xTmp[i]=temp2*temp2+temp3*temp3;
			if( xTmp[i]<mouseRange2 ) temp1=true;
		}
		if(tempb!=temp1) forcedRender=true;
		tempb=temp1;
		
		if (temp1 || forcedRender){

			if(this.mouseX<xPrim[0])
				bCenterX=xPrim[0];
			else if(this.mouseX>xPrim[xPrim.length-1])
				bCenterX=xPrim[xPrim.length-1];
			else
				bCenterX=this.mouseX;
			bCenterY=docY;

			temp2=bCenterX-this.mouseX;
			temp3=bCenterY-this.mouseY;
			temp1 = mouseRange-Math.sqrt(temp2*temp2+temp3*temp3);
			if(temp1<0)temp1=0;

			for(i=0;i<xPrim.length;i++){
				temp2=xPrim[i]-bCenterX;
				h=Math.sqrt(temp2*temp2+backZ*backZ);
				temp2/=h; //temp2=alpha
				temp3=backZ/h; //temp3=beta
				h+=temp1;
				xTmp[i]=temp2*h+bCenterX;
				zTmp[i]=temp3*h;
				yTmp[i]=bCenterY;
			}
		
			for(i=0;i<xPrim.length;i++){
				iconArray[i].setPosition(xTmp[i],yTmp[i]+zTmp[i]);
				iconArray[i].setZoom(zTmp[i]/mFactor);
				iconArray[i].setZIndex(1000+zTmp[i]);
			}
		}
	}

	this.explotionNode = function(){}
	this.contractionNode = function(){}
	
	this.explode = function(clickHandler){
		if(status!=0) return;
		status=1;
		renderOff=true;

		temp2=bCenterX-this.mouseX;
		temp3=bCenterY-this.mouseY;
		temp1 = mouseRange-Math.sqrt(temp2*temp2+temp3*temp3);
		if(temp1<0)temp1=0;
		
		tempb = {
			H: new Array(),
			A: new Array(),
			B: new Array(),
			t: 0,
			S: 0,
			endExplosion: function(){
				for(i=0;i<xPrim.length;i++) iconArray[i].hide();
				this.explotionNode = function(){}
				tempb=null;
				clickHandler();
			}
		};

		for(i=0;i<xPrim.length;i++){
			temp2=xPrim[i]-bCenterX;
			tempb.H[i]=Math.sqrt(temp2*temp2+backZ*backZ);
			tempb.A[i]=temp2/tempb.H[i];
			tempb.B[i]=backZ/tempb.H[i];
			tempb.H[i]+=temp1;
		}
		
		if( explosion=='zoom' )
			this.explotionNode = function(){
				tempb.S=tempb.t*tempb.t;
				tempb.t++;
		
				for(i=0;i<xPrim.length;i++){
					xTmp[i]=tempb.A[i]*(tempb.H[i]+tempb.S)+bCenterX;
					zTmp[i]=tempb.B[i]*(tempb.H[i]+tempb.S);
					iconArray[i].setPosition(xTmp[i],yTmp[i]+zTmp[i]);
					iconArray[i].setZoom(zTmp[i]/mFactor);
					iconArray[i].setOpacity(100-tempb.S);
				}
			
				if(tempb.S<100) return true;
				tempb.endExplosion();
				return false;
			}
		else if( explosion=='motionFade' )
			this.explotionNode = function(){
				tempb.S=tempb.t*tempb.t;
				tempb.t++;
		
				for(i=0;i<xPrim.length;i++){
					xTmp[i]=tempb.A[i]*(tempb.H[i]+tempb.S)+bCenterX;
					iconArray[i].setPosition(xTmp[i],yTmp[i]+zTmp[i]);
					iconArray[i].setOpacity(100-tempb.S);
				}
			
				if(tempb.S<100) return true;
				tempb.endExplosion();
				return false;
			}
		else if( explosion=='fade' )
			this.explotionNode = function(){
				tempb.S=tempb.t*tempb.t;
				tempb.t++;
		
				for(i=0;i<xPrim.length;i++)
					iconArray[i].setOpacity(100-tempb.S);
			
				if(tempb.S<100) return true;
				tempb.endExplosion();
				return false;
			}
		
		sExplodeThread(dockID);	
	}

	this.contract = function(e){
		if(status!=1) return;
		status=0;
		renderOff=true;

		if(e) sDock.getMouse(e);
		else if(document.all) sDock.getMouse();

		temp2=bCenterX-this.mouseX;
		temp3=bCenterY-this.mouseY;
		temp1 = mouseRange-Math.sqrt(temp2*temp2+temp3*temp3);
		if(temp1<0)temp1=0;

		tempb = {
			H: new Array(),
			A: new Array(),
			B: new Array(),
			t: 11,
			S: 0,
			endContraction: function(){
				renderOff=false;
				this.contractionNode = function(){}
				tempb=null;
			}
		};

		for(i=0;i<xPrim.length;i++){
			temp2=xPrim[i]-bCenterX;
			tempb.H[i]=Math.sqrt(temp2*temp2+backZ*backZ);
			tempb.A[i]=temp2/tempb.H[i];
			tempb.B[i]=backZ/tempb.H[i];
			tempb.H[i]+=temp1;
		}
		
		if( explosion=='zoom' || explosion=='motionFade' )
			this.contractionNode = function(){
				tempb.S=tempb.t*tempb.t;
				tempb.t--;
				if(tempb.t<0)tempb.S=0;
		
				for(i=0;i<xPrim.length;i++){
					xTmp[i]=tempb.A[i]*(tempb.H[i]+tempb.S)+bCenterX;
					zTmp[i]=tempb.B[i]*(tempb.H[i]+tempb.S);
					iconArray[i].setPosition(xTmp[i],yTmp[i]+zTmp[i]);
					iconArray[i].setZoom(zTmp[i]/mFactor);
					iconArray[i].setOpacity(100-tempb.S);
				}
			
				if(tempb.S>0) return true;
				tempb.endContraction();
				return false;
			}
		else if( explosion=='fade' )
			this.contractionNode = function(){
				tempb.S=tempb.t*tempb.t;
				tempb.t--;
				if(tempb.t<0)tempb.S=0;
		
				for(i=0;i<xPrim.length;i++)
					iconArray[i].setOpacity(100-tempb.S);
			
				if(tempb.S>0) return true;
				tempb.endContraction();
				return false;
			}

		for(i=0;i<xPrim.length;i++) iconArray[i].show();
		sContractionThread(dockID);	
	}

	this.reAlign();
	this.render();
	sDock.addDockObject( this );
}

function sExplodeThread(dockID){
	if( sDock.sDObjects[dockID].explotionNode() )
		window.setTimeout('sExplodeThread('+dockID+');',1);
}

function sContractionThread(dockID){
	if( sDock.sDObjects[dockID].contractionNode() )
		window.setTimeout('sContractionThread('+dockID+');',1);
}

//--- SS Dock Object Handler --------------------------------------------------------

sDock.sDObjects = new Array();

sDock.addDockObject = function( newObject ){
	sDock.sDObjects.push( newObject );
}

sDock.deleteDockObject = function( object ){
	sDock.sDObjects.splice( object.id , 1);
}

sDock.reAlignAll = function(){
	sDock.getWinDimentions();
	for ( i=0; i<sDock.sDObjects.length; i++) {sDock.sDObjects[i].reAlign();sDock.sDObjects[i].render(true);}
}
sDock.scrollAll = function(){
	sDock.getWinScrlOff();
	for ( i=0; i<sDock.sDObjects.length; i++) {sDock.sDObjects[i].scrollDock();sDock.sDObjects[i].render(true);}
}
sDock.renderAll = function(e){
	sDock.getMouse(e);
	for ( i=0; i<sDock.sDObjects.length; i++) {sDock.sDObjects[i].render();}
}

//--- Window Event Handlers ---------------------------------------------------------

sDock.prototype.winWidth = 0;
sDock.prototype.winHeight = 0;
sDock.prototype.winScrlOffX = 0;
sDock.prototype.winScrlOffY = 0;
sDock.prototype.mouseX = 0;
sDock.prototype.mouseY = 0;

sDock.getWinDimentions = function(){}
sDock.getWinScrlOff = function(){}
sDock.getMouse = function(){}

sDock.classInit = function(){
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		sDock.getWinDimentions = function(){
			sDock.prototype.winWidth = window.innerWidth-16;
			sDock.prototype.winHeight = window.innerHeight;
		}
	}
	else if( document.body && ( document.body.clientWidth!=null || document.body.clientHeight!=null ) ) {
		//IE 4
		sDock.getWinDimentions = function(){
			sDock.prototype.winWidth = document.body.clientWidth;
			sDock.prototype.winHeight = document.body.clientHeight;
		}
	}
	else if( document.documentElement && ( document.documentElement.clientWidth!=null || document.documentElement.clientHeight!=null ) ) {
		//IE 6+ in 'standards compliant mode'
			sDock.getWinDimentions = function(){
			sDock.prototype.winWidth = document.documentElement.clientWidth-16;
			sDock.prototype.winHeight = document.documentElement.clientHeight;
		}
	}

	if( typeof( window.pageYoffsEut ) == 'number' ) {
		//Netscape
		sDock.getWinScrlOff = function(){
			sDock.prototype.winScrlOffX = window.pageXoffsEut;
			sDock.prototype.winScrlOffY = window.pageYoffsEut;
		}
	} else if( document.body && typeof( document.body.scrollLeft ) == 'number' ) {
		//DOM compliant
		sDock.getWinScrlOff = function(){
			sDock.prototype.winScrlOffX = document.body.scrollLeft;
			sDock.prototype.winScrlOffY = document.body.scrollTop;
		}
	} else if( document.documentElement && typeof( document.documentElement.scrollLeft ) == 'number' ) {
		//IE6 standard
		sDock.getWinScrlOff = function(){
			sDock.prototype.winScrlOffX = document.documentElement.scrollLeft;
			sDock.prototype.winScrlOffY = document.documentElement.scrollTop;
		}
	} else if ( typeof( window.scrollX ) == 'number' ){
		sDock.getWinScrlOff = function(){
			sDock.prototype.winScrlOffX = window.scrollX;
			sDock.prototype.winScrlOffY = window.scrollY;
		}
	} else if ( typeof( window.pageXOffset) == 'number' ){
		sDock.getWinScrlOff = function(){
			sDock.prototype.winScrlOffX = window.pageXOffset;
			sDock.prototype.winScrlOffY = window.pageYOffset;
		}
	}
	
	if(document.all?true:false)
		sDock.getMouse = function(){
			sDock.prototype.mouseX = window.event.clientX + document.body.scrollLeft;
			sDock.prototype.mouseY = window.event.clientY + document.body.scrollTop;
		}
	else
		sDock.getMouse = function(e){
			sDock.prototype.mouseX = e.pageX;
			sDock.prototype.mouseY = e.pageY;
		}
	
	sDock.prevWinOnResize = window.onresize;
	if(sDock.prevWinOnResize)
		window.onresize = function(e){
			sDock.prevWinOnResize(e);
			sDock.reAlignAll();
		}
	else
		window.onresize = sDock.reAlignAll;
	
	sDock.prevWinOnScroll = window.onscroll;
	if(sDock.prevWinOnScroll)
		window.onscroll = function(e){
			sDock.prevWinOnScroll(e);
			sDock.scrollAll();
		}
	else
		window.onscroll = sDock.scrollAll;
	
	sDock.prevDocMouseMove = document.onmousemove;
	if(sDock.prevDocMouseMove)
		document.onmousemove = function(e){
			sDock.prevDocMouseMov(e);
			sDock.renderAll(e);
		}
	else
		document.onmousemove = 	sDock.renderAll;
	
		sDock.getWinScrlOff();
		sDock.getWinDimentions();

	sDock.classInit = function(){}
}