// ------------------------------------
// arrayChecksum
// ------------------------------------	
arrayChecksum : function (value)
{			
	var result = "";

	for (key in value)
		{	
		var segment = "";
		
		if (value[key] != null)
		{	
			if (typeof(value[key]) == "object")
			{								 
				segment = SNDK.tools.arrayChecksum (value[key]);
			}	
			else
			{
				segment = value[key];
			}
		}	
			
		result += segment;
	}				
		
	return result;			
	//return hex_md5 (result);	
},



setButtonLabel : function (element, text)
{
	if (element)
	{
		if (element.childNodes[0])
		{
			element.childNodes[0].nodeValue = text;
		}
		else if (element.value)
		{
			element.value = text;
		}
		else
		{
			element.innerHTML = text;
		}
	}
},

sortArrayHash : function (array, key, direction)
{
	if (direction == "numeric")
	{
		compareFunc = 	function compare (first, second)
						{	
							return first[key]-second[key];
						} 
	}
	else if (direction == "ascending") 
	{																					
		compareFunc = 	function (first, second) 
						{       									
							if (first[key].toLowerCase () < second[key].toLowerCase ())
							{
								return -1;	
							}
						
							if (first[key].toLowerCase () > second[key].toLowerCase ())
							{
								return 1;	
							}
							return 0;      								
						}													
	} 								
	else 
	{  					
		compareFunc = 	function (second, first) 
						{    									    							
							if (first[key].toLowerCase () < second[key].toLowerCase ())
							{
								return -1;	
							}
		
							if (first[key].toLowerCase () > second[key].toLowerCase ())
							{
								return 1;	
							}
						}
	}

	array.sort (compareFunc);
},
	
dateToYMD : function (date)
{
    var d = date.getDate ();
    var m = date.getMonth ()+1;
    var y = date.getFullYear ();    
    return '' + y +'/'+ (m<=9?'0'+m:m) +'/'+ (d<=9?'0'+d:d);
},

dateToYMDHM : function (date)
{
    var d = date.getDate ();
    var m = date.getMonth ()+1;
    var y = date.getFullYear ();
    var H = date.getHours ();
    var M = date.getMinutes ();
    return '' + y +'/'+ (m<=9?'0'+m:m) +'/'+ (d<=9?'0'+d:d) +" "+ (H<=9?'0'+H:H) +":"+ (M<=9?'0'+M:M);       
},
dateToTimestamp : function (date)
{	
	return Math.round (date/1000);

	//return Math.floor( date.getTime ()/1000 );
},

// ***************************************************************************************************************************************************
// ** getTicks																																		**
// ***************************************************************************************************************************************************
// ** Return ticks since epoch.																														**
// ***************************************************************************************************************************************************
getTicks : function ()
{		
    return new Date ().getTime ();
},

timestampToDate : function (timestamp)
{	
	var timeZoneOffset = (new Date ().getTimezoneOffset () * 60000) ;
	
	return new Date((timestamp * 1000) + timeZoneOffset);
},

// ***************************************************************************************************************************************************
// ** getStyle																																		**
// ***************************************************************************************************************************************************
// ** Returns value of the current style on the specifed element.																					**
// ***************************************************************************************************************************************************	
getStyle : function (element, property)
{
	var result = null;
				
	if (client.browser == "Explorer" &&  parseInt (client.version) < 9)
	{
		// Internet Explore 8 and below does not work with getComputedStyle, 
		// so we use currentStyle instead.
		
		// Stylenames are abit differrent when using currentStyle, and only the
		// moste used are being altered here. Fell free to add more if need.
		
		// PADDING
		if (property == "padding-left") property = "paddingLeft";
		if (property == "padding-right") property = "paddingRight";
		if (property == "padding-top") property = "paddingTop";
		if (property == "padding-bottom") property = "paddingBottom";
		
		// MARGIN
		if (property == "margin-left") property = "marginLeft";
		if (property == "margin-right") property = "marginRight";		
		if (property == "margin-top") property = "marginTop";
		if (property == "margin-bottom") property = "marginBottom";	
		
		// BORDER
		if (property == "border-left-width") property = "borderLeftWidth";
		if (property == "border-right-width") property = "borderRightWidth";		
		if (property == "border-top-width") property = "borderTopWidth";
		if (property == "border-bottom-width") property = "borderBottomWidth";				
		
		result = element.currentStyle[property];
	}
	else	
	{
		// All moderen browsers work with getComputedStyle.
	
		//result = document.defaultView.getComputedStyle (element, null).getPropertyValue (property);
		result = window.getComputedStyle (element, null).getPropertyValue (property);
	}
	
	return result;
},

getStyle2 : function (element)
{
var result = null;
				
	if (client.browser == "Explorer" &&  parseInt (client.version) < 9)
	{
		result = element.currentStyle;
	}
	else	
	{
		// All moderen browsers work with getComputedStyle.
	
		result = window.getComputedStyle (element, null);
	}
	
	return result;
},

// ***************************************************************************************************************************************************
// ** newGuid																																		**
// ***************************************************************************************************************************************************
// ** Create new GUID, that is compatible with C# and other popular languages.																		**
// ***************************************************************************************************************************************************		

emptyGuid : "00000000-0000-0000-0000-000000000000",

newGuid : function ()
{
	var chars = '0123456789abcdef'.split ('');

	var uuid = [], rnd = Math.random, r;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4'; // version 4

	for (var index = 0; index < 36; index++)
	{
		if (!uuid[index])
		{
			r = 0 | rnd ()*16;
			uuid[index] = chars[(index == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
	}

	return uuid.join ('');
},

// ***************************************************************************************************************************************************
// ** getXML																																		**
// ***************************************************************************************************************************************************
// ** Get XML document from URL.																													**
// ***************************************************************************************************************************************************		
getXML : function (URL)
{
	var xmlhttp = SNDK.tools.getXmlHttpObject ();
	xmlhttp.open ("GET", URL + "?"+ Math.random(), false);
									
	xmlhttp.send (null);		
	xmldoc = xmlhttp.responseXML;
	
	return xmldoc;
},

// ***************************************************************************************************************************************************
// ** randomNumber																																	**
// ***************************************************************************************************************************************************
// ** Returns a random number between two values.																									**
// ***************************************************************************************************************************************************
randomNumber : function (begin, end)
{
	return Math.floor ((end-begin) * Math.random ()) + begin;		
},

// ***************************************************************************************************************************************************
// ** reloadURL																																		**
// ***************************************************************************************************************************************************
// ** Reloads the current window.																													**
// ***************************************************************************************************************************************************
reloadURL : function ()
{
	document.location.reload (true);
},

// ***************************************************************************************************************************************************
// ** setURL																																		**
// ***************************************************************************************************************************************************
// ** Set given URL on the current window, if no frame is specified.																				**
// ***************************************************************************************************************************************************
setURL : function (url, frame)
{
	if (frame == null)
	{
		if (url == document.location.href)
		{
			SNDK.tools.reloadURL ();
		}
		else
		{			
			document.location.href = url;
		}
	}
	else
	{
		parent.frames[frame].location = url;
	}		
},




derefItem : function (array)
{
	var result;



	if (array.constructor == Array)
	{
		result = new Array ();
	}
	
	if (array.constructor == Object)
	{
		result = {};
	}
	
	for (index in array)
	{
		switch (typeof(array[index]))
		{
			case "object":
			{				
				if (array[index].constructor == Array)
				{					
					result[index] = SNDK.tools.derefItem (array[index]);
				}
				else if (array.constructor == Object)
				{					
					result[index] = SNDK.tools.derefItem (array[index]);
				}
				
				break;
			}
			
			default: 
			{
				result[index] = array[index];
				break;
			}
		}
	}

	return result;
},	









derefArray : function (array)
{
	var temp = new Array ();
	for (index in array)
	{
		temp[index] = array[index];
	
//		var index2 = temp.length;
//		temp[index2] = new Array ();
//		for (index3 in array[index])
//	{
//			temp[index2][index3] = array[index][index3];
//		}			
	}

	return temp;		
},


stopPropogation : function (e) 
{
	if (e)
	{
		e.cancelBubble = true;
	}
//	if (e && e.stopPropogation)
//	{
 //		e.stopPropogation ();
 //	} 
//	else if (window.event && window.event.cancelBubble)
//	{
 // 		window.event.cancelBubble = true;
  //	}  	
},


getXmlDocFromString : function (xml)
{
	xmldoc = null;
	
	if (window.DOMParser)
	{
 		parser = new DOMParser ();
		xmldoc = parser.parseFromString (xml, "text/xml");
	}
	else // Internet Explorer
	{
		xmldoc = new ActiveXObject ("Microsoft.XMLDOM");
		xmldoc.async = "false";		
		xmldoc.loadXML (xml);
	} 
	
	return xmldoc;
},

getXmlHttpObject : function ()
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
},



// ------------------------------------
// getElementPosition
// ------------------------------------	
getElementPosition : function (obj, onlyparent)
{
	var curleft = curtop = 0;
	if (obj.offsetParent) 
	{
		do 
		{
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			if (onlyparent)
			{
				break;
			}
		} while (obj = obj.offsetParent);
	}	
	return [curleft,curtop];
},

// ------------------------------------
// trimEnd
// ------------------------------------	
trimEnd : function (string, character)
{	
	try
	{
	if (string.substr (string.length - character.length, character.length) == character)
	{
		return string.substr (0, string.length - character.length);
	}
	}
	catch (error)
	{
	
	}
	
	return string;
},

arrayContains : function (array, contains)
{
	var result = false;

	for (index in array)
	{
		if (array[index] == contains)	
		{
			result = true;
		}
	}
	
	return result;
},

// ------------------------------------
// getQuery
// ------------------------------------	
getQuery : function ()
{
	var url = window.location.toString();			
	url.match(/\?(.+)$/);
		
	var params = RegExp.$1;
	params = params.split("&");
	var queryStringList = {};
 
	for(var i=0;i<params.length;i++)
	{
		var tmp = params[i].split("=");
		queryStringList[tmp[0]] = unescape(tmp[1]);
	} 
	
	return queryStringList;
},

// ------------------------------------
// textSelectionDisable
// ------------------------------------	
textSelectionDisable : function (element)
{
	if (typeof element.onselectstart != "undefined") 
	{
		element.onselectstart = function (){ return false; };
	}
	else if (typeof element.style.MozUserSelect != "undefined") 
	{
		element.style.MozUserSelect = "none";
	}
	else
	{
		element.onmousedown = function () { return false; };
	}
},			

// ------------------------------------
// textSelectionEnable
// ------------------------------------	
textSelectionEnable : function (element)
{
	if (typeof element.onselectstart != "undefined") 
	{
		element.onselectstart = "";
	}
	else if (typeof element.style.MozUserSelect != "undefined") 
	{
		element.style.MozUserSelect = "inherit";
	}
	else
	{
		element.onmousedown = "";
	}
},

setElementOpacity : function (element, opacity)
{
	element.style.opacity = (opacity / 100);
	element.style.MozOpacity = (opacity / 100);
	element.style.KhtmlOpacity = (opacity / 100);
	element.style.filter = "alpha(opacity=" + opacity + ")";
},

// ------------------------------------
// changeOpacityByObject
// ------------------------------------	
changeOpacityByObject : function (object, opacity) 
{
	var style = object.style;
	style.opacity = (opacity / 100);
	style.MozOpacity = (opacity / 100);
	style.KhtmlOpacity = (opacity / 100);
	style.filter = "alpha(opacity=" + opacity + ")";
},

// ------------------------------------
// setOpacityByObject
// ------------------------------------	
setOpacity : function (object, opacity) 
{
//	var style = object.style;
	object.style.opacity = (opacity / 100);
	object.style.MozOpacity = (opacity / 100);
	object.style.KhtmlOpacity = (opacity / 100);
	object.style.filter = "alpha(opacity=" + opacity + ")";
},

// ------------------------------------
// getKey
// ------------------------------------	
getKey : function (event)
{
	var key;
	if (!event && window.event) 
	{
		event = window.event;
	}
	
	if (event) 
	{
		key = event.keyCode;
	}
	else
	{
		key = event.which;	
	}
			
	return key;
},
		


// ------------------------------------
// getStyledMargin
// ------------------------------------	
getStyleMargin : function (element)
{
	var result = {top: 0, left: 0, right: 0, bottom: 0};
	
		result.top = parseInt (SNDK.tools.getStyle (element, "margin-top"));
		result.left = parseInt (SNDK.tools.getStyle (element, "margin-left"));
		result.right = parseInt (SNDK.tools.getStyle (element, "margin-right"));
		result.bottom = parseInt (SNDK.tools.getStyle (element, "margin-bottom"));
	
	return result;
},

// ------------------------------------
// getStyledMargin
// ------------------------------------	
getElementStyledMargin : function (element)
{

		var result = {top: 0, left: 0, right: 0, bottom: 0};
	
	result.top = parseInt (SNDK.tools.getStyle (element, "margin-top"));
	result.left = parseInt (SNDK.tools.getStyle (element, "margin-left"));
	result.right = parseInt (SNDK.tools.getStyle (element, "margin-right"));
	result.bottom = parseInt (SNDK.tools.getStyle (element, "margin-bottom"));
	
	return result;
},


getElementStyledPadding : function (element)
{
	var styles = SNDK.tools.getStyle2 (element);
	
	var result = new Array ();
	result["vertical"] = 0;
	result["horizontal"] = 0;

	var dimensions = new Array ();
//	var numberRe = new RegExp(/^\d+/);
//	console.log (numberRe.exec (styles.getPropertyValue ("padding-left")[0][0]));
	
	dimensions["paddingLeft"] = parseInt (styles.getPropertyValue ("padding-left"));
	dimensions["paddingRight"] = parseInt (styles.getPropertyValue ("padding-right"));
	dimensions["paddingTop"] = parseInt (styles.getPropertyValue ("padding-top"));
	dimensions["paddingBottom"] = parseInt (styles.getPropertyValue ("padding-bottom"));
	dimensions["marginLeft"] = parseInt (styles.getPropertyValue ("margin-left"));
	dimensions["marginRight"] = parseInt (styles.getPropertyValue ("margin-right"));
	dimensions["marginTop"] = parseInt (styles.getPropertyValue ("margin-top"));
	dimensions["marginBottom"] = parseInt (styles.getPropertyValue ("margin-bottom"));				
	dimensions["borderLeft"] = parseInt (styles.getPropertyValue ("border-left-width"));
	dimensions["borderRight"] = parseInt (styles.getPropertyValue ("border-right-width"));
	dimensions["borderTop"] = parseInt (styles.getPropertyValue ("border-top-width"));
	dimensions["borderBottom"] = parseInt (styles.getPropertyValue ("border-bottom-width"));				

//	dimensions["paddingLeft"] = parseInt (styles["paddingLeft"]);
//	dimensions["paddingRight"] = parseInt (styles["paddingRight"]);
//	dimensions["paddingTop"] = parseInt (styles["paddingTop"]);
//	dimensions["paddingBottom"] = parseInt (styles["paddingBottom"]);
//	dimensions["marginLeft"] = parseInt (styles["marginLeft"]);
//	dimensions["marginRight"] = parseInt (styles["marginRight"]);
//	dimensions["marginTop"] = parseInt (styles["marginTop"]);
//	dimensions["marginBottom"] = parseInt (styles["marginBottom"]);				
//	dimensions["borderLeft"] = parseInt (styles["borderLeftWidth"]);
//	dimensions["borderRight"] = parseInt (styles["borderRightWidth"]);
//	dimensions["borderTop"] = parseInt (styles["borderTopWidth"]);
//	dimensions["borderBottom"] = parseInt (styles["borderBottomWidth"]);				
	


//	console.log ("paddingleft"+ dimensions.paddingLeft);
//	console.log ("paddingright"+ dimensions.paddingRight);
//	console.log ("marginleft"+ dimensions.marginLeft);
//	console.log ("marginright"+ dimensions.marginRight);
//	console.log ("borderleft"+ dimensions.borderLeft);
//	console.log ("borderright"+ dimensions.borderRight);	
	

	result["vertical"] = dimensions.paddingTop + dimensions.paddingBottom + dimensions.marginTop + dimensions.marginBottom + dimensions.borderTop + dimensions.borderBottom;
	result["horizontal"] = dimensions.paddingLeft + dimensions.paddingRight + dimensions.marginLeft + dimensions.marginRight + dimensions.borderLeft + dimensions.borderRight;
	
	return result;
},


getElementStyledBoxSize : function (element)
{
	var result = new Array ();
	result["vertical"] = 0;
	result["horizontal"] = 0;

	var dimensions = new Array ();
	
	var styles = SNDK.tools.getStyle2 (element);
	
	// PADDING	
	//parseInt (styles.getPropertyValue (""));
	
	dimensions["paddingLeft"] = parseInt (styles["paddingLeft"]);
	dimensions["paddingRight"] = parseInt (styles["paddingRight"]);
	dimensions["paddingTop"] = parseInt (styles["paddingTop"]);
	dimensions["paddingBottom"] = parseInt (styles["paddingBottom"]);
	
	// MARGIN
//	dimensions["marginLeft"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-left")));
//	dimensions["marginRight"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-right")));
//	dimensions["marginTop"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-top")));
//	dimensions["marginBottom"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-bottom")));				
	
 	dimensions["marginLeft"] = parseInt (styles["marginLeft"]);
	dimensions["marginRight"] = parseInt (styles["marginRight"]);
	dimensions["marginTop"] = parseInt (styles.getPropertyValue ("margin-top"));
	dimensions["marginBottom"] = parseInt (styles.getPropertyValue ("margin-bottom"));
	
	//BORDER
	dimensions["borderLeft"] = parseInt (styles.getPropertyValue ("border-left-width"))
	dimensions["borderRight"] = parseInt (styles.getPropertyValue ("border-right-width"));
	dimensions["borderTop"] = parseInt (styles.getPropertyValue ("border-top-width"));
	dimensions["borderBottom"] = parseInt (styles.getPropertyValue ("border-bottom-width"));
	
	//console.log (dimensions)	
	
	for (index in dimensions)
	{
		if (dimensions[index] < 0)
		{
			dimensions[index] = 0;
		}
	}
	
	
	result["vertical"] = (dimensions.paddingTop + dimensions.paddingBottom + dimensions.marginTop + dimensions.marginBottom + dimensions.borderTop + dimensions.borderBottom);
	result["horizontal"] = (dimensions.paddingLeft + dimensions.paddingRight + dimensions.marginLeft + dimensions.marginRight + dimensions.borderLeft + dimensions.borderRight);
	result["dimensions"] = dimensions;
	
	return result;
},

getElementStyledBoxSizeOLD : function (element)
{
	var result = new Array ();
	result["vertical"] = 0;
	result["horizontal"] = 0;

	var dimensions = new Array ();
	
	// PADDING
	dimensions["paddingLeft"] = parseInt (SNDK.tools.getStyle (element, "padding-left"));
	dimensions["paddingRight"] = parseInt (SNDK.tools.getStyle (element, "padding-right"));
	dimensions["paddingTop"] = parseInt (SNDK.tools.getStyle (element, "padding-top"));
	dimensions["paddingBottom"] = parseInt (SNDK.tools.getStyle (element, "padding-bottom"));
	
	// MARGIN
//	dimensions["marginLeft"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-left")));
//	dimensions["marginRight"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-right")));
//	dimensions["marginTop"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-top")));
//	dimensions["marginBottom"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-bottom")));				
	
 	dimensions["marginLeft"] = parseInt (SNDK.tools.getStyle (element, "margin-left"));
	dimensions["marginRight"] = parseInt (SNDK.tools.getStyle (element, "margin-right"));
	dimensions["marginTop"] = parseInt (SNDK.tools.getStyle (element, "margin-top"));
	dimensions["marginBottom"] = parseInt (SNDK.tools.getStyle (element, "margin-bottom"));				
	
	//BORDER
	dimensions["borderLeft"] = parseInt (SNDK.tools.getStyle (element, "border-left-width"));
	dimensions["borderRight"] = parseInt (SNDK.tools.getStyle (element, "border-right-width"));
	dimensions["borderTop"] = parseInt (SNDK.tools.getStyle (element, "border-top-width"));
	dimensions["borderBottom"] = parseInt (SNDK.tools.getStyle (element, "border-bottom-width"));	
	
	//console.log (dimensions)	
	
	for (index in dimensions)
	{
		if (dimensions[index] < 0)
		{
			dimensions[index] = 0;
		}
	}
	
	
	result["vertical"] = (dimensions.paddingTop + dimensions.paddingBottom + dimensions.marginTop + dimensions.marginBottom + dimensions.borderTop + dimensions.borderBottom);
	result["horizontal"] = (dimensions.paddingLeft + dimensions.paddingRight + dimensions.marginLeft + dimensions.marginRight + dimensions.borderLeft + dimensions.borderRight);
	result["dimensions"] = dimensions;
	
	return result;
},



// ------------------------------------
// getElementStyleWidth
// ------------------------------------	
getElementStyledWidth : function (element)
{
	var styles = SNDK.tools.getStyle2 (element);
	
	// LeftMargin
	//var leftmargin = SNDK.tools.getStyle (element, "margin-left");
	var leftmargin = styles.getPropertyValue ("margin-left");
	
	if (leftmargin != null && leftmargin != "auto")
	{
		leftmargin = parseInt (leftmargin, 10);
	}
	else
	{
		leftmargin = 0;
	}
		
	// RightMargin	
	//var rightmargin = SNDK.tools.getStyle (element, "margin-right");
	var rightmargin = styles.getPropertyValue ("margin-right");
		
	if (rightmargin != null && rightmargin != "auto")
	{
		rightmargin = parseInt (rightmargin, 10);
	}
	else
	{
		rightmargin = 0;
	}
	
	// LeftPadding
	//var leftpadding = parseInt (SNDK.tools.getStyle (element, "padding-left"), 10);
	var leftpadding = parseInt (styles.getPropertyValue ("padding-left"), 10);
	
	// RightPadding
	//var rightpadding = parseInt (SNDK.tools.getStyle (element, "padding-right"), 10);
	var rightpadding = parseInt (styles.getPropertyValue ("padding-right"), 10);
		
	// Width
	//var width = SNDK.tools.getStyle (element, "width");
	var width = styles.getPropertyValue ("width");
	if (width != null && width != "auto")
	{
		width = parseInt (width, 10);
	}
	else
	{
		width = 0;
	}
	
	// Done
	return width + leftmargin + rightmargin + leftpadding + rightpadding;		
},

// ------------------------------------
// getElementStyleHeight
// ------------------------------------	
getElementStyledHeight : function (element)
{
	// TopMargin
	var topmargin = SNDK.tools.getStyle (element, "margin-top");
	
	if (topmargin != null && topmargin != "auto")
	{
		topmargin = parseInt (topmargin, 10);
	}
	else
	{
		topmargin = 0;
	}
		
	// BottomMargin
	var bottommargin = SNDK.tools.getStyle (element, "margin-bottom");
		
	if (bottommargin != null && bottommargin != "auto")
	{
		bottommargin = parseInt (bottommargin, 10);
	}
	else
	{
		bottommargin = 0;
	}
	
	// TopPadding
	var toppadding = parseInt (SNDK.tools.getStyle (element, "padding-top"), 10);
	
	// BottomPadding
	var bottompadding = parseInt (SNDK.tools.getStyle (element, "padding-bottom"), 10);
		
	// Height
	var height = SNDK.tools.getStyle (element, "height");

	if (height != null && height != "auto")
	{
		height = parseInt (height, 10);
	}
	else
	{
		height = 0;
	}

	// Done	
	return height + topmargin + bottommargin + toppadding + bottompadding;	
},

// ------------------------------------
// getElementInnerWidth
// ------------------------------------	
getElementInnerWidth : function (element)
{

	// LeftMargin
//	var leftmargin = SNDK.tools.getStyle (element, "margin-left");	
	
//	if (leftmargin != null && leftmargin != "auto")
//	{
//		leftmargin = parseInt (leftmargin, 10);
//	}
//	else
//	{
//		leftmargin = 0;
//	}
		
	// RightMargin	
//	var rightmargin = SNDK.tools.getStyle (element, "margin-right");
		
//	if (rightmargin != null && rightmargin != "auto")
//	{
//		rightmargin = parseInt (rightmargin, 10);
//	}
//	else
//	{
//		rightmargin = 0;
//	}
	
	// LeftPadding
//	var leftpadding = parseInt (SNDK.tools.getStyle (element, "padding-left"), 10);
	
	// RightPadding
//	var rightpadding = parseInt (SNDK.tools.getStyle (element, "padding-right"), 10);
		
	// Width
	var width = element.offsetWidth;
		
	var box = SNDK.tools.getElementStyledBoxSize (element);
		
	// Done
//	console.log (element)
//	console.log (box)
//	console.log (width)
	
	return width - box.dimensions.paddingLeft - box.dimensions.paddingRight - box.dimensions.borderLeft - box.dimensions.borderRight;
	//return width - 10
//	return width - leftmargin - rightmargin - leftpadding - rightpadding;		
//	return width - leftpadding - rightpadding;		
},

// ------------------------------------
// getElementInnerHeight
// ------------------------------------	
getElementInnerHeight : function (element)
{
	// TopMargin
//	var topmargin = SNDK.tools.getStyle (element, "margin-top");
	
//	if (topmargin != null && topmargin != "auto")
//	{
//		topmargin = parseInt (topmargin, 10);
//	}
//	else
//	{
//		topmargin = 0;
//	}
		
	// BottomMargin
//	var bottommargin = SNDK.tools.getStyle (element, "margin-bottom");
//		
//	if (bottommargin != null && bottommargin != "auto")
//	{
//		bottommargin = parseInt (bottommargin, 10);
//	}
//	else
//	{
//		bottommargin = 0;
//	}
	
	// TopPadding
//	var toppadding = parseInt (SNDK.tools.getStyle (element, "padding-top"), 10);
	
	// BottomPadding
//	var bottompadding = parseInt (SNDK.tools.getStyle (element, "padding-bottom"), 10);
	
	var box = SNDK.tools.getElementStyledBoxSize (element);
				
	// Height
	var height = parseInt (element.offsetHeight, 10);
	
	return height - box.dimensions.paddingTop - box.dimensions.paddingBottom - box.dimensions.borderTop - box.dimensions.borderBottom;
	
	// Done
//	return height - topmargin - bottommargin - toppadding - bottompadding;	
},


// ------------------------------------
// opacityChange
// ------------------------------------	
opacityChange : function (element, opacity) 
{
	var object;
	if (typeof element == "string")
	{
		object = document.getElementById (element);
	}
	else
	{
		object = element;
	}

	object.style.opacity = (opacity / 100);
	object.style.MozOpacity = (opacity / 100);
	object.style.KhtmlOpacity = (opacity / 100);
	object.style.filter = "alpha(opacity=" + opacity + ")";
},

// ------------------------------------
// newElement
// ------------------------------------	
	newElement : function (type, classname, id, parent)
	{		
	
	
		if (typeof classname == "object" && classname != null)
		{
			var element;
			var tempelement;		
			var options = classname;
			
			if (type != null)
			{
				if (type == "iframe")
				{
					tempelement = document.createElement ("div");
//					tempelement.style.display = "none";	
					
					id = "";					
					if (options.name != null && options.id == null)
					{
						id = options.name;
					}
					else if (options.name == null && options.id != null)
					{
						id = options.id;
					}					
					else
					{
						id = SNDK.tools.newGuid ();
					}
					
					tempelement.innerHTML = "<iframe name='"+ id +"' id='"+ id +"' style='width: 100%; height: 100%; border: none;'></iframe>";
					document.body.appendChild (tempelement);
					element = document.getElementById (id);
				}
				else
				{
					element = document.createElement (type);
					
				}
			}
			else
			{
				throw "Cant create new element without a type.";
			}
			
			if (options.className != null)
			{
				element.className = options.className;	
			}
			
			if (options.id != null)
			{	
				if (type != "iframe")
				{
					element.setAttribute ("id", options.id);
				}
			}
			

			
			if (options.innerHTML != null)
			{
				element.innerHTML = options.innerHTML;
			}
			
			if (options.src != null)
			{
				if (type != "iframe")
				{
					element.src = options.src;
				}
			}
			
			if (options.scrolling != null)
			{
				element.scrolling = options.scrolling;
			}
			
			if (options.width != null)
			{
				if (type != "iframe")
				{						
					element.style.width = options.width;
				}
				else
				{
					tempelement.style.width = options.width;
				}
			}
			
			if (options.height != null)
			{
				if (type != "iframe")
				{						
					element.style.height = options.height;
				}
				else
				{	
					tempelement.style.height = options.height;
				} 
			}			

			if (options.onLoad != null)
			{
				element.onload = options.onLoad;
			}			

			if (options.name != null)
			{
				if (type != "iframe")
				{
					element.setAttribute ("name", options.name);
				}
				
			}

			if (options.href != null)
			{
				element.setAttribute ("href", options.href);
			}
			
			if (options.display != null)
			{
				element.style.display =  options.display;
			}

			if (options.method != null)
			{
				element.method =  options.method;
			}
			
			if (options.target != null)
			{
				if (typeof options.target == "string")
				{
					element.target =  options.target;
				}
				else
				{
					element.target =  options.target.id;
				}
			}
			
			if (options.encoding != null)
			{
				element.encoding =  options.encoding;
			}
			

			
			if (options.type != null)
			{
				element.type = options.type;
			}

			if (options.value != null)
			{
				element.value = options.value;
			}
			
			if (options.method != null)
			{
				element.method = options.method;
			}
			
			if (options.enctype != null)
			{
				element.enctype = options.enctype;
			}
			

			if (options.appendTo != null)
			{
				if (type == "iframe")
				{
					options.appendTo.appendChild (tempelement);
					if (options.src != null)
					{
						element.src = options.src;
					}
				}
				else
				{
					options.appendTo.appendChild (element);
				}
			}

			return element;
		}
		else
		{
			var element;
		
			if (type != null)
			{
				element = document.createElement (type);
			}
			else
			{
				throw "Cant create new element without a type.";
			}
		
			if (classname != null)
			{
				element.className = classname;	
			}
		
			if (id != null)
			{
				element.setAttribute ("id", id);
			}
		
			if (parent != null)
			{
				parent.appendChild (element);				
			}
			
			return element;	
		}	
	},

// ------------------------------------
// newElement
// ------------------------------------	
newElement2 : function (type, options)
{			
	var element;
	var tempelement;
	
	if (type != null)
	{
		element = document.createElement (type);
	}
	else
	{
		throw "Cant create new element without a type.";
	}

	if (options.id != null)
	{	
		element.setAttribute ("id", options.id);
	}
	
	if (options.className != null)
	{
		element.className = options.className;	
	}
			
	if (options.appendTo != null)
	{
		options.appendTo.appendChild (element);
	}
	
	if (options.innerHTML != null)
	{
		element.innerHTML = options.innerHTML;
	}
	
	if (options.src != null)
	{
		element.src = options.src;
	}
	
	if (options.scrolling != null)
	{
		element.scrolling = options.scrolling;
	}
	
	if (options.width != null)
	{
		element.style.width = options.width;
	}
	
	if (options.height != null)
	{
		element.style.height = options.height;
	}			
				
	if (options.display != null)
	{
		element.style.display =  options.display;
	}

	if (options.method != null)
	{
		element.method =  options.method;
	}

	if (options.target != null)
	{
		if (typeof options.target == "string")
		{
			element.target =  options.target;
		}
		else
		{
			element.target =  options.target.id;
		}
	}
	
	if (options.encoding != null)
	{
		element.encoding =  options.encoding;
	}
	
	if (options.type != null)
	{
		element.type = options.type;
	}

	if (options.value != null)
	{
		element.value = options.value;
	}

	return element;
},

// ------------------------------------
// getPageSize
// ------------------------------------	
getPageSize : function () 
{	        
	var xScroll, yScroll;

	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}

	var windowWidth, windowHeight;

	if (self.innerHeight) {	// all except Explorer
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth; 
		} else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	

	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = xScroll;		
	} else {
		pageWidth = windowWidth;
	}

	return [pageWidth,pageHeight];
},
	
	
	
// ------------------------------------
// getScrollOffsets
// ------------------------------------		
getScrollOffsets : function () 
{
	return [window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ]
//			alert (document.documentElement.scrollTop)
//			return Element._returnOffset(
//			      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
//			      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
},

// ------------------------------------
// getWindowSize
// ------------------------------------	
getWindowSize : function ()
{
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
	    //IE 6+ in 'standards compliant mode'
	    myWidth = document.documentElement.clientWidth;
	    myHeight = document.documentElement.clientHeight;
	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	    //IE 4 compatible
	    myWidth = document.body.clientWidth;
	    myHeight = document.body.clientHeight;
	  }
	  
	  return [myWidth, myHeight];
}		
