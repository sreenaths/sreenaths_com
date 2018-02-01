if (!window.sTestUtil)
	window.sTestUtil={
		assert: function(result,msg){
			if(typeof(result)!="undefined"&&result!=false) document.write("<font style='color:#287828'>Success : </font>"+msg);
			else document.write("<B style='color:#B50103'>Failure : </B>"+msg);
			document.write("<BR/>");
		},
		printHeader: function(msg){
			document.write(" <B>"+msg+" :</B><BR/>");
		},
		printFooter: function(){
			document.write("<BR/>");
		},

		printLineHeader: function(msg){
			var line="-----------------------------------------------";
			document.write("--- "+msg+" "+line.substring(msg.length)+"<BR/>");
		},

		createObject: function(htmlstr){
			document.getElementById("container").innerHTML+=htmlstr;
		},
		clearObjects: function(){
			document.getElementById("container").innerHTML="";
		},

		setup: function(){},
		tearDown: function(){},
		testSetCount: 0,

		run: function(testSet){
			if(testSet.Group_Name==null)
				document.write("<B style='color:#2059B4'>Test Set : "+sTestUtil.testSetCount+"</B><hr/>");
			else
				document.write("<B style='color:#2059B4'>"+testSet.Group_Name+"</B><hr/>");

			sTestUtil.testSetCount++;

			for(var i in testSet )
				if(typeof(testSet[i])=="function"){
					sTestUtil.printHeader("Running " + i.replace(/_/g,' '));
					sTestUtil.setup(testSet);
					testSet[i]();
//					sTestUtil.clearObjects();
					sTestUtil.tearDown(testSet);
					sTestUtil.printFooter();
				}
		}
	}