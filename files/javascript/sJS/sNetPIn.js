//---- SS Net Plug-In 0.1 ------------------------------------------------------------------
//  Date : 07-12-2009
//-----------------------------------------------------------------------------------

if(window.sUtil){
	windows.sUtil.net .Ajax = function(args){
				var xmlhttp = sUtil.net.getXmlHttpObject();
				var handler=null;
				if(xmlhttp==null) return "Your browser does not support XMLHTTP!";
				if(args.url==null) return "URL not found!";

				if( args.handler!=null ){
					handler=args.handler;
					xmlhttp.onreadystatechange=function(){
						handler(xmlhttp.readyState);
					}
				}
	}

}
