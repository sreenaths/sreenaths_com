//---- SS Image Base 1.0 -----------------------------------------------------
//     Date : 24-10-2009
//-----------------------------------------------------------------------------------

if(!window.sUtil) sJS.include("sUtil");

document.write("<div id='sImageShack' style='z-index:1000;position:absolute;width:0px;height:0px;left:0;top:0;'></div>");	

function sImageBase( args ){

	if ( this.iShack == null ) this.iShack = document.getElementById( 'sImageShack' );

	var parentHandler = null;

	this.onClick = function(){}
	this.handler = function(){}

	if( typeof(args.handler)=='function' ) this.handler = args.handler;

	if( typeof(args.parentHandler)=='function' ) {
		parentHandler=args.parentHandler;
		this.onClick = function(){
			parentHandler(this.handler);
		}
	}
	else
		this.onClick=this.handler;

};