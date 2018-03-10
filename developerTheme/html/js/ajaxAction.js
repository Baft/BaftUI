
	
	var interval;
	var postFileContentType="multipart/form-data";
	var postNormalContentType="application/x-www-form-urlencoded";
	var baseUrl="/cgi-bin/";
	var urlList={
		"rules":{"getList":"if-Rules-list.pl","doList":"if-Rules-do.pl" , "fileList":"if-Files-list.pl" , "groupList":"if-Groups-list.pl"} ,
		"files":{"getList":"if-Files-list.pl","doFile":"if-Files-do.pl" },
		"clients":{"getList":"if-Clients-list.pl","actionClient":"if-Client-action.pl","statusClient":"if-Client-status.pl","groupClient":"if-Groups-list.pl","gatherClient":"if-Gather-list.pl","doClient":"if-Clients-do.pl"}
		};

	var dataToSend;
	var dataRecived;
	var contentLoaded;
	
	
	function explode(serial){
	
		var serialRaws=serial.split("|");
		var exploded;
		var rawObj=new Object();
		
		if(serialRaws.length!=0){
			//if(serialRaws[0]==null) serialRaws.shift();
			//if(serialRaws.length!=0 && serialRaws[length-1]==null) serialRaws.pop();
			//if(serialRaws.length!=0)
				exploded=new Array(serialRaws.length);
		}else if(serial!=null) exploded=new Array(1);
		
		for(r=0;r<=serialRaws.length-1;r++){
			var pairs=serialRaws[r].split("&");
			
			if(pairs.length!=0){
				var tempObj=new Object();
				for(p=0;p<=pairs.length-1;p++){
					if(pairs[p]!=null){
						var KVs=pairs[p].split("=");
						var field=new String(KVs[0]);
						var value=KVs[1];
						tempObj[field]=value;
					
					}
				}
			}else if(serialRaws[r]!=null){
				var tempObj=new Object();
				var KVs=serialRaws[r].split("=");
				var field=new String(KVs[0]);
				var value=KVs[1];
				tempObj[field]=value;
			}

			exploded[r]=tempObj;
		}
		return exploded;
	}

	
	function implodeObject(reqObject,middleDelim,lastDelim){
		var dataToSend="";
		for(key in reqObject) {
	        if (typeof reqObject[key] == 'string' && reqObject[key]!=null && typeof reqObject[key]!= "undefined"){
	            dataToSend = dataToSend + key + middleDelim + reqObject[key] + lastDelim ;
	        }
		 }
		
		return dataToSend;
	}
	
	function implodeAsocArray(array){
		return $.param(array);
	}

	
	function traverse(){}
	
	function ajax(cntType,reqData ,reqUrl,onSuccess,onComplete,onBeforSend){
		
        if(typeof onSuccess!="function")
			onSuccess=function(){};
		if(typeof onComplete!="function")
			onComplete=function(){};
 		if(typeof onBeforSend!="function")
			onBeforSend=function(){};
			
		$.ajax({
		    async: false,
		    beforeSend : function(xhrObj){
		            onBeforSend(xhrObj);
		            },
		    cache: false,
		    complete:function(xhrObj,result){
		            onComplete(xhrObj,result);
		            },
		   type: "POST",
		   contentType:cntType,
		   url: reqUrl,
		   data: reqData,
		   success: function(msg){
		     onSuccess(msg);
		   }
		});
	}
	
	function loadContent(container,url,urlQ,onComplete){
		$(container).load(url,urlQ,onComplete);
	}
	
	function waite(onOff,attachMouse){
		var container=$("<div/>");
		$(container).attr({"id":"waiting"});
		var moveLoader=function(e){
								 var EOffset=$(e).offset();
								 var targetOffset=$(e.target).offset();
								 $("#waiting").css({"top":(e.pageY+targetOffset.top+20),"left":(e.pageX  +targetOffset.left+20)});
								 $("#wrapper").text("( e.clientX, e.clientY ) - " + "( " + e.clientX + ", " + e.clientY + " )");
								 };
		if(attachMouse===true){
			$("body").bind("mousemove",moveLoader);
			container.css({"position":"absolute","width":"30px","height":"30px","z-index":"9999","backgroundColor":"#999"});
		}else
			container.css({"position":"absolute","width":"100%","height":"100%","z-index":"9999","cursor":"wait"});
			
		if(onOff===true){
			$("body").append(container);
		}else if(onOff===false){
			if(typeof (document.getElementById('waiting')) != "undefined" ){
				$("body").unbind("mousemove",moveLoader);
				$("#waiting").remove();
				}
		}
		
	}

	function actionBox(){// make box in bottom of page and show what happend on request / responce
			//may call on other function to show and put some text on it
			//OR may call with each ajax function calling and stay show for N seconde
		}
	
	function timeout(startStop,timeOutObj,func,delay){
		var timeoutCnt;
		if(startStop==true){
			timeoutCnt=setTimeout(func,15000);
		}else{
			if(timeoutCnt!="undefined" && timeoutCnt!=null)
				//var myString = new java.lang.String("Hello world") ;
				delete(timeoutCnt);
		}
		return timeoutCnt;
	}
	
	function getUrl(fileName){
		return baseUrl+fileName;
	}

