// -------------------------------------------------------------------------------------------------------------------------
// Ajax (application, applicationparam, applicationdatafield, requestmethod, asynchronous)
// -------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
request : function (application, applicationparam, applicationdatafield, requestmethod, asynchronous)
{
	var _initialized = false;

	var _xmlhttp = null;	
		
	var _application = application;	
	var _applicationdatafield = applicationdatafield;		
	var _applicationparam = applicationparam;
	var _requestmethod = requestmethod;
	var _asynchronous = asynchronous;

	var _seed = Math.random();			
	var _data = null;	
	
	var _sentdata = "";

	// Event handlers.
	var _event_onsent = null;
	var _event_onreceiving = null;
	var _event_onloaded = null;			

	// Methods
	this.send = send;		
		
	// Properties
	this.respons = valueRespons;		
	this.onSent = valueOnSent;
	this.onReceiving = valueOnReceiving;		
	this.onLoaded = valueOnLoaded;
	
	this.sentData = valueSentData;

	// Init object.
	init ();

	function init ()
	{
		// Create new xmlhttp object.
		_xmlhttp = getXmlHttpObject();

		// Check if browser supports AJAX
		if (_xmlhttp == null)
		{
			alert ("Your browser does not support AJAX!");
			return;
		}
					
		_xmlhttp.onreadystatechange = function ()
		{			
			if (_xmlhttp.readyState == 2 && _event_onsent != null)
			{
				_onsent ();
			}

			if (_xmlhttp.readyState == 3 && _event_onreceiving != null)
			{
				_onreceiving ();
			}			

			if (_xmlhttp.readyState == 4 && _event_onloaded != null)
			{														
				if (_asynchronous)
				{				
					parseRespons ();
				}
				
				if (_event_onloaded != null)
				{						
					_event_onloaded (_data);
				}
			}						
		};			
		
		// Finished
		_initialized = true;	
	}

	function parseRespons ()
	{
		_data = new Array();						
	
		var xmldoc = _xmlhttp.responseXML;
		var root = xmldoc.getElementsByTagName ('ajax').item(0);				
		
		
		
		parseResponsRecursive (root.childNodes, _data);
		
		
		if (_data["success"] == false)
		{
			//throw _data["exception"].split ("|")[0];
			throw _data["exception"];
		}			
	}
	
	function parseResponsRecursive (Nodes, Data)
	{		
		var len = Nodes.length;		
		for (var index = 0; index < len; index++)
		{
			var node = Nodes.item(index);
						
			//console.log (node.tagName)
			switch (node.attributes.getNamedItem ("type").value)
			{
				case "object":
				{
				
					//var list = {};
				
					//for (var index2 = 0, len2 = node.childNodes.length; index2 < len2; index2++)
					//{
					
					var hashtable = {};
					//var node2 = node.childNodes[index2];
					//console.log (node2)
						
					parseResponsRecursive (node.childNodes, hashtable);
						
					//list[list.length] = hashtable;
					//} 
						
																				
					Data[node.tagName] = hashtable;					
					break;
				}
								
			
				case "string":
				{
					if (node.firstChild != null)
					{
						Data[node.tagName] = node.childNodes[0].nodeValue;
					}
					else
					{
						Data[node.tagName] = "";
					}

					break;
				}
				
				case "decimal":
				{				
					if (node.firstChild != null)
					{
						//sXUL.console.log ("DEC "+ parseFloat (node.childNodes[0].nodeValue))
					
						Data[node.tagName] = parseFloat (node.childNodes[0].nodeValue);
						
						//sXUL.console.log ("DECIMAL IN: "+ Data[node.tagName])
					}
					else
					{
						Data[node.tagName] = 0;
					}

					break;
				}
				
				case "boolean":
				{				
					if (node.firstChild != null)
					{
						if (node.childNodes[0].nodeValue == "1")
						{						
							Data[node.tagName] = true;
						}
						else
						{
							Data[node.tagName] = false;
						}
					}
					else
					{
						Data[node.tagName] = false;
					}
				
					break;
				}
				
				case "hashtable":
				{
					var hashtable = new Array ();					
					
					parseResponsRecursive (node.childNodes, hashtable);
					
					Data[node.tagName] = hashtable;
					
					break;
				}
				
				case "list":
				{
					var list = new Array();
					var len2 = node.childNodes.length;
					for (var index2 = 0; index2 < len2; index2++)
					{
						var hashtable = {};
						var node2 = node.childNodes[index2];
						
						//console.log (node2.childNodes)
						
						parseResponsRecursive (node2.childNodes, hashtable);
						//parseResponsRecursive (node2, hashtable);
						
						
						
						list[index2] = hashtable;
						//list[list.length] = hashtable;
						//list[index2] = hashtable;
					} 
					
																								
					Data[node.tagName] = list;
									
					break;
				}
			}
		}
	}
	
	function send (data)
	{
		var success = false;
	
		if (_initialized)			
		{
			// Create XML document.
			var xmldata = "";					
			//xmldata += "<?xml version='1.0' encoding='ISO-8859-1'?>";
			xmldata += "<ajax>\n";			
									
			xmldata = parseRequestRecursive (xmldata, data);			
						
			xmldata += "</ajax>\n";			

			// We can eithet request by using GET or POST.			
			if (_requestmethod == "GET")
			{
				var dtmNow = new Date();
				var strMS = dtmNow.valueOf;
			
				// Create request URL.
				var url = "";
				url += _application +"?";		
				url += _applicationdatafield +"=";
				url += xmldata;
				url += "&seed="+ Math.floor(Math.random()*1000000);
				url += "&cachescrambler="+ strMS;
	
				if (_applicationparam)
				{									
					var params = _applicationparam.split(";");
					for (var param = 0; param < params.length; param++)
					{
						url += "&";					
						url += params[param];
					}
				}
				
				// Open request.
				_xmlhttp.open("GET", url, _asynchronous);
				
				// Send request.
				_xmlhttp.send(null);
				
			}
			else if (_requestmethod == "POST")
			{
				// Create request URL.
				var url = "";
				url += _application;
				
				// Open request.
				_xmlhttp.open("POST", url, _asynchronous);							
				
				// Then we encode the XML data into multipart/form-data.
				var boundaryseed = Math.floor(Math.random()*100001) +''+  Math.floor(Math.random()*100001) +''+ Math.floor(Math.random()*100001);
				var boundary = '--' + boundaryseed;
				var requestbody = boundary + '\r\n';

				var dtmNow = new Date();
				var strMS = dtmNow.valueOf
				var seed = Math.floor(Math.random()*1000000);

				
				// Add applicationparams.
				var params = _applicationparam.split(";");
				
				requestbody += 'Content-Disposition: form-data; name="random1"\r\n';
				requestbody += '\r\n';
				requestbody += seed + '\r\n' 					
				requestbody += boundary + '\r\n' 
				
				requestbody += 'Content-Disposition: form-data; name="random2"\r\n';
				requestbody += '\r\n';
				requestbody += strMS + '\r\n' 					
				requestbody += boundary + '\r\n' 
				

				for (var param = 0; param < params.length; param++)
				{
					var values = params[param].split("=");
					requestbody += 'Content-Disposition: form-data; name="'+ values[0] +'"' + '\r\n';
					requestbody += '\r\n';
					requestbody += values[1] + '\r\n' 					
					requestbody += boundary + '\r\n' 
				}
				
				// Add xmldata.									
				requestbody += 'Content-Disposition: form-data; name="'+ _applicationdatafield +'"' + '\r\n' 
				requestbody += '\r\n' 
				requestbody += xmldata + '\r\n' 
				requestbody += boundary +'--\r\n';

				// Prepare header information.	
				_xmlhttp.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundaryseed);
				_xmlhttp.setRequestHeader("Content-length", requestbody.length);
											
				_sentdata = requestbody;								
					
				// Send request.				
				_xmlhttp.send(requestbody);
			}
				
			// If not asynchronous we need to parse respons manually.
			if (!_asynchronous)
			{
				parseRespons ();
			}
				
			success = true;
		}
		return success;
	}
	
	function parseRequestRecursive (document, data)
	{				
		for (var index in data)
		{
			switch (typeof(data[index]))
			{
				case "string":
				{
					document += "<"+ index +" type=\"string\">\n";
					document += "<![CDATA[";
					document += data[index];
					document += "]]>\n";
					document += "</"+ index +">\n";				
					
					break;
				}
				
				case "number":
				{
					document += "<"+ index +" type=\"string\">\n";
					document += "<![CDATA[";
					document += data[index];
					document += "]]>\n";
					document += "</"+ index +">\n";				
					
					break;
				}
				
								
				case "boolean":
				{								
					document += "<"+ index +" type=\"boolean\">\n";
					document += "<![CDATA[";
					if (data[index] == true)
					{
						document += "1";
					}
					else
					{
						document += "0";
					}
					
					document += "]]>\n";
					document += "</"+ index +">\n";				

					break;
				}
				
				case "object":
				{				
					if (data[index].constructor == Array)
					{
						
						var islist = true;						
						for (index2 in data[index])
						{
							if (isNaN (index2))
							{
								islist = false;
							}
						}

						if (islist)
						{
								document += "<"+ index +" type=\"list\">\n";	
								for (var index2 in data[index]) 
								{
									document += "<item>\n";						
									document = parseRequestRecursive (document, data[index][index2]);
									document += "</item>\n";						
								}
								document += "</"+ index +">\n";											
						
						}
						else
						{
							document += "<"+ index +" type=\"hashtable\">\n";	
																
								
								//for (var index2 in data[index]) 
								//{
								//console.log (data[index])
									
									document = parseRequestRecursive (document, data[index]);
								//}
								document += "</"+ index +">\n";																											
						
						}
					}
					else if (data[index].constructor == Object)
					{
						document += "<"+ index +" type=\"object\">\n";
						document = parseRequestRecursive (document, data[index]);
						document += "</"+ index +">\n";	
					}
								
					break;
				}				
			}			
		}
		
		return document;	
	}	
	
	function valueSentData ()
	{
		return _sentdata;
	}
	
	function valueRespons ()
	{
		return _data;
	}
	
	function valueOnSent (value)
	{
		_event_onsent = value;
	}
	
	function valueOnReceiving (value)
	{
		_event_onreceiving = value;
	}
	
		
	function valueOnLoaded (value)
	{	
		_event_onloaded = value;
	}

	function getXmlHttpObject ()
	{
		if (window.XMLHttpRequest)
		{
			// code for IE7+, Firefox, Chrome, Opera, Safari.
			return new XMLHttpRequest ();
		}
		
		if (window.ActiveXObject)
		{
			// code for IE6, IE5.
			return new ActiveXObject ("Microsoft.XMLHTTP");
		}	
		return null;
	}		
}