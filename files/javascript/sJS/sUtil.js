//---- SS Util 0.5 ------------------------------------------------------------------
//  Date : 24-10-2009
//-----------------------------------------------------------------------------------

if(!window.sUtil)
	window.sUtil = {
		browserName: navigator.appName,
		browserVersion: parseFloat(navigator.appVersion.split("MSIE")[1]),
		vacuous: sJS.SJSRoot+'sImage/vacuous.gif',
		addEvent: function(obj,type,fn) {
			if (obj.addEventListener) {
				obj.addEventListener(type,fn,false);
		 		return true;
			} else if (obj.attachEvent) {
				var fun = fn+'';
				fun = fun.substring(0,fun.indexOf('('));
				obj['e'+type+fun] = fn;
				obj[type+fun] = function() { obj['e'+type+fun]( window.event );}
				return obj.attachEvent('on'+type, obj[type+fun]);
			} else {
				obj['on'+type] = fn;
				return true;
			}
			return false;
		},
		IEPngFix: function(imgID){
			if ((parseFloat(navigator.appVersion.split("MSIE")[1]) >= 5) && (document.body.filters)){
				if( document.images[imgID].src==sUtil.vacuous ) return;
				document.images[imgID].style.height=document.images[imgID].height;
				document.images[imgID].style.width=document.images[imgID].width;
				document.images[imgID].style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+document.images[imgID].src+"',sizingMethod='scale')";
				document.images[imgID].src=sUtil.vacuous;
			}
		},
		main: function(fun){
			if( navigator.appName=="Microsoft Internet Explorer" ) window.attachEvent('onload', fun);
			else window.addEventListener('load', fun,true);
		},
		final: function(fun){
			if( navigator.appName=="Microsoft Internet Explorer" ) window.attachEvent('onbeforeunload', fun);
			else window.addEventListener('unload', fun,true);		
		},
		includeJS: function(JSPath){
			document.write('<script type="text/javascript" src="'+ JSPath + '"></scr'+'ipt>');
		},
		getNextZindex: function(parentID){  
			var highestIndex = 0;
			var currentIndex = 0;
			var elArray = Array();
			if(parentID){ elArray = document.getElementById(parentID).getElementsByTagName('*'); }else{ elArray = document.getElementsByTagName('*'); }
			for(var i=0; i < elArray.length; i++){
				if (elArray[i].currentStyle){currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);}
				else if(window.getComputedStyle){currentIndex = parseFloat(document.defaultView.getComputedStyle(elArray[i],null).getPropertyValue('z-index'));}
				if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex;}
			}
			return(highestIndex+1);
		},
		sleep: function(milliSec,useHTTP){
			var now = new Date();
			var exitTime = now.getTime() + milliSec ;
			var xmlhttp = sUtil.net.getXmlHttpObject();
			while(true){
				try{
					if(xmlhttp!=null){
						xmlhttp.open("POST","http://127.0.0.1",false);
						if(useHTTP) xmlhttp.send(null);
					}
				}catch(err){}
				now = new Date();
				if(now.getTime() > exitTime) break;
			}
		},
		get: function(element_id){
			return document.getElementById(element_id);
		},
		inspect: function(obj){
			document.write("<hr/>");
			for(i in obj) document.write(i+" : "+obj[i]);
		},
		net: {
			getXmlHttpObject: function (){
				if (window.XMLHttpRequest){ // IE7+, Firefox, Chrome, Opera, Safari
					return new XMLHttpRequest();
				}
				if (window.ActiveXObject){// IE6, IE5
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
				return null;
			}
		}
	}
