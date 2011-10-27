includeJS : function (attributes)
{
	var xmlhttp = SNDK.tools.getXmlHttpObject ();
	xmlhttp.open ("GET", attributes.url, false);								
	xmlhttp.send (null);		
	
	var head = document.getElementsByTagName ("HEAD").item (0);
	var script = document.createElement ("script");
	var text = xmlhttp.responseText + attributes.appendText;
	
	
	script.language = "javascript";
	script.type = "text/javascript";
	
	script.defer = true;	
	script.text = text;
	head.appendChild (script);	
}