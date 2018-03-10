$(function(){
	
	function runCron() {
		
		  var deferred = $.Deferred();
		  SYNC_PANEL();
		  
		  setInterval(function() { 
			  if(typeof cronUrl!="undefined" && cronUrl!="" && cronUrl!=null)
				  ajax(postNormalContentType,{} ,cronUrl,function(){;},onComplete,onBeforeSend);
		  }, 5000);
		 
		  return deferred.promise();
		  
		}
	
	function onBeforeSend(xhrObj){
		
	}
	
	 function onComplete(xhrObj,vv){
		 setSyncObject(xhrObj.responseText);
         var responseObject=$.parseJSON(xhrObj.responseText);
         SYNC_PANEL(responseObject);
	 }
	 
	 function getSyncObject(){
		 var keepSyncString=getCookie("keepSync");	 
		 if(keepSyncString==null){
			setSyncObject();
			keepSyncString='{}';
		}
		return $.parseJSON(keepSyncString);
	 }
	 
	 function setSyncObject(syncString){
		 if(syncString==null || typeof syncString=="undefined")
			 syncString='{}';
		 setCookie("keepSync",syncString);
	 }
	 
	 function getSyncData( name ) {
		 var keepSyncObject= getSyncObject();
		 
		 if(keepSyncObject!=null && typeof keepSyncObject[name]!="undefined")
			 return keepSyncObject[name];
		 
		 return null;
		}

		
	function setSyncData( name, value){
		var keepSyncObject= getSyncObject();
		
		JSON.stringify = JSON.stringify || function (obj) {
		    var t = typeof (obj);
		    if (t != "object" || obj === null) {
		        // simple data type
		        if (t == "string") obj = '"'+obj+'"';
		        return String(obj);
		    }
		    else {
		        // recurse array or object
		        var n, v, json = [], arr = (obj && obj.constructor == Array);
		        for (n in obj) {
		            v = obj[n]; t = typeof(v);
		            if (t == "string") v = '"'+v+'"';
		            else if (t == "object" && v !== null) v = JSON.stringify(v);
		            json.push((arr ? "" : '"' + n + '":') + String(v));
		        }
		        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		    }
		};

		keepSyncObject[name]=value;
		var keepSyncString=JSON.stringify(keepSyncObject);
		setCookie("keepSync","");
		setCookie("keepSync",keepSyncString);
	}
		
	 
	 function SYNC_PANEL(responseObject){
		 
		 if(typeof respnseObject!="object")
			 respnseObject=null;
		 
			 /*################################*/
			 /*####### CALL SYNC ACTION #######*/
			 /*################################*/
			 
		new_message(responseObject);
	 }
	 /*###########################################################################*/
	 /*########################### SYNC ACTIONS  #################################*/
	 /*###########################################################################*/
	 
	 function new_message(responseObject){
		 var messages; 
		 var countMsgOnCookie;
		 
		 if(responseObject!=null && typeof responseObject.message!="undefined"){
			 messages=responseObject.message
			 var unvisited=messages.messages;
			 if(unvisited!=""){
				 for(var i in unvisited){				
					 notify('پیغام جدید', unvisited[i]["title"], {
							vPos: 'bottom',
							autoClose: false,
							iconOutside: false,
							showCloseOnHover: false,
							groupSimilar: false
						});
				 }
			 } 
			 
			 countMsgOnCookie=getSyncData("counMsg");
			 
			 if(typeof messages=="object" && typeof messages.count!="undefined" && countMsgOnCookie!=messages.count){
				setSyncData("counMsg",messages.count);
				
			 }
		 }
		 
		 countMsgOnCookie=getSyncData("counMsg");
		 countMsgOnCookie=(countMsgOnCookie==null || countMsgOnCookie=="" || typeof countMsgOnCookie=="undefined")?"0":countMsgOnCookie;
		 $("#last_messege_widget .count").text(countMsgOnCookie);

	 }

	 runCron();
	
});