//---- sJS 0.1 ------------------------------------------------------------------
//  Date : 22-02-10
//-------------------------------------------------------------------------------

if(!window.sJS){
	window.sJS = {
		initLib: function(){
			var scriptTags = document.getElementsByTagName("script");
			var scriptPath= "";
			var i=0;
			for(var i=0; i<scriptTags.length;i++ ){
				scriptPath = scriptTags[i].attributes.getNamedItem("src").value;
				if( scriptPath.substr(scriptPath.length-6)=="sJS.js" ){
					sJS.SJSRoot = scriptPath.substr(0,scriptPath.length-6);
					break;
				}
			}
			switch(sJS.getBrowserCode()){
				case "ie": sJS.extendCatalog({
						"sImage": "sImage/sImageIE.js"
					});
				break;
			}
		},
		include: function(scriptName){
			if(sJS.scriptCatalog[scriptName]!=null) document.write("<script type='text/javascript' src='"+sJS.SJSRoot+sJS.scriptCatalog[scriptName]+"'></scr"+"ipt>");
			else return false;
			return true;
		},
		getBrowserCode: function(){
			if( navigator.appName=="Microsoft Internet Explorer" ) return "ie";
			return "def";
		},
		getLibPath: function(scriptName){
		},
		extendCatalog: function(newCatalog){
			if( typeof(newCatalog)!="object" ) return null;
			for(i in newCatalog) sJS.scriptCatalog[i] = newCatalog[i];
			return sJS.scriptCatalog;
		},
		scriptCatalog: {
			"sImageBase": "sImage/sImageBase.js",
			"sImage": "sImage/sImageDef.js",
			"sDock": "sDock.js",
			"sUtil": "sUtil.js",
			"sNet Plug-In": "sNetPIn.js",
			"sWidgets": "sWidgets.js",
			"sThemeManager": "sThemeManager.js"
		}
	}
	sJS.initLib();
}