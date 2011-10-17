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
		
		if (_data["success"] == "false")
		{
			throw _data["exception"];
		}			
	}
	
	function parseResponsRecursive (Nodes, Data)
	{
		for (var index = 0, len = Nodes.length; index < len; index++)
		{
			var node = Nodes.item(index);

			switch (node.attributes.getNamedItem ("type").value)
			{
				case "object":
				{
					var list = new Array();
				
					for (var index2 = 0, len2 = node.childNodes.length; index2 < len2; index2++)
					{
					console.log (node.childNodes[index2]);
					var hashtable = new Array ();
					var node2 = node.childNodes[index2];
						
						parseResponsRecursive (node.childNodes[index2], hashtable);
						
						list[list.length] = hashtable;
					} 
																								
					Data[node.tagName] = list;					
					break;
				}
								
			
				case "string":
				{
					//if (node.firstChild != null)
					//{
						Data[node.tagName] = node.childNodes[0].nodeValue;
					//}
					//else
					//{
					//	Data[node.tagName] = "";
					//}

					break;
				}
				
//				case "boolean":
//				{
//					break;
//				}
				
				case "hashtable":
				{
					var hashtable = {};
					
					parseResponsRecursive (node.childNodes, hashtable);
					
					Data[node.tagName] = hashtable;
					
					break;
				}
				
				case "list":
				{
					var list = new Array();
				
					for (var index2 = 0, len2 = node.childNodes.length; index2 < len2; index2++)
					{
						var hashtable = new Array ();
						var node2 = node.childNodes[index2];
						
						parseResponsRecursive (node2.childNodes, hashtable);
						
						list[list.length] = hashtable;
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
			xmldata += "<variables>\n";			
			
			xmldata = parseRequestRecursive (xmldata, data);			
						
			xmldata += "</variables>\n";			

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
				
//				case "boolean":
//				{					
//					break;
//				}
				
				case "object":
				{
					if (data[index].constructor == Array)
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
					else if (data[index].constructor == Object)
					{
						document += "<"+ index +" type=\"hashtable\">\n";
						document = parseRequestRecursive (document, data[index]);
						document += "</"+ index +">\n";	
					}
								
					break;
				}				
			}			
		}
		
		return document;	
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