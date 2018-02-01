
//------ TEST FUNCTIONS ---------------------------------------------------------------------------

//---- SETUP -----------
sJS.include("sImage");

var testFunctionsSJS ={
	Group_Name: 'S-JS Main Test',
	Test_Init: function(){
		sTestUtil.assert(sJS,"sJS created.");
		sTestUtil.assert(sJS.SJSRoot,"sJS Root found.");
		sTestUtil.assert(sJS.scriptCatalog["sImage"],"Catalog created.");
		if(navigator.appName=="Microsoft Internet Explorer") 			sTestUtil.assert((sJS.scriptCatalog["sImage"].substr(sJS.scriptCatalog["sImage"].length-5)=="IE.js"),"Browser based catalog extention.");
		sTestUtil.assert(sJS.include("sImage"),"Package inclusion module test.");
		sTestUtil.assert(sImage,"Image Package included.(Setup->sImage)"); //--- Included by Setup.
		sTestUtil.assert(sUtil,"Image Package included.(Setup->sImage->sUtil)"); //--- Included ny Setup -> sImage
	}
}

//--------------------------------------------------------------------------------------------------------

var testHelpers = {
	focussed: false,
	focusEvent: function(){
		testHelpers.focussed=true;
	}
}

var testFunctionsUtil ={
	Group_Name: 'S-Util Test',
	Test_Add_Event: function(){
		sTestUtil.createObject('<input type="text" id="text_box"/>');
		sTestUtil.assert(sUtil.addEvent(sUtil.get("text_box"),'focus',testHelpers.focusEvent)," Attaching Event.");
		sTestUtil.assert(!testHelpers.focussed,"Before triggering focus event.");
		sUtil.get("text_box").focus();
		sTestUtil.assert(testHelpers.focussed,"Focus Event triggered. (Under investigation for failure in IE)");
	},
	Test_Util: function(){
		sTestUtil.assert(sUtil.getNextZindex("container")==1,"Next index without any object.");
		sTestUtil.createObject('<div style="position:absolute;z-index:10;" id="testDiv1"></div>');
		sTestUtil.assert(sUtil.getNextZindex("testDiv1")==1,"Next index with div as parent.");
		sTestUtil.assert(sUtil.getNextZindex("container")==11,"Next index with an object having z-index 10.");
	}
}


//--------------------------------------------------------------------------------------------------------
