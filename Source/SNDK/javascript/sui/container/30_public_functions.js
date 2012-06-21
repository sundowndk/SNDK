// ------------------------------------
// Public functions
// ------------------------------------		
// ------------------------------------
// refresh
// ------------------------------------				
function functionRefresh ()
{
	refresh ();
}		

// ------------------------------------
// dispose
// ------------------------------------				
function functionDispose ()
{
	dispose ();
}				

function functionAddTitleBarUIElement (type, attributes)
{
	return addTitleBarUIElement (type, attributes)
}

function functionGetTitleBarUIElement (tag)
{
	return getTitleBarUIElement (tag);
}

// ------------------------------------
// content
// ------------------------------------				
function functionContent ()
{
	return _elements["contentcenter"];
}

// ------------------------------------
// addUIElement
// ------------------------------------							
function functionAddUIElement (element)
{
	var count = _temp.uiElements.length;
	
 	_temp.uiElements[count] = element;
 		 	
 	element.setAttribute ("managed", true);
 	element.setAttribute ("appendTo", _elements["contentcenter"]);
}		

// ------------------------------------
// getAttribute
// ------------------------------------						
function functionGetAttribute (attribute)
{
	switch (attribute)
	{
		case "id":
		{
			return _attributes[attribute];
		}
		
		case "tag":
		{
			return _attributes[attribute];
		}
		
		case "stylesheet":
		{
			return _attributes[attribute];
		}
		
		case "width":
		{
			if (_attributes.widthType == "percent")
			{
				return _attributes.width + "%";
			}

			if (_attributes.widthType == "pixel")
			{
				return _attributes.width + "px";
			}
		}
		
		case "height":
		{
			if (_attributes.heightType == "percent")
			{
				return _attributes.height + "%";
			}

			if (_attributes.heightType == "pixel")
			{
				return _attributes.height + "px";
			}
		}
		
		case "appendTo":
		{
			return _attributes[attribute];			
		}			
		
		case "managed":
		{
			return _attributes[attribute];			
		}
		
		case "canScroll":
		{
			return _attributes[attribute];
		}

		case "title":
		{
			return _attributes[attribute];			
		}
		
		case "icon":
		{
			return _attributes[attribute];			
		}
				
		default:
		{
			throw "No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
}

// ------------------------------------
// setAttribute
// ------------------------------------						
function functionSetAttribute (attribute, value)
{
	switch (attribute)
	{
		case "id":
		{
			throw "Attribute with name ID is ready only.";
			break;
		}
		
		case "tag":
		{
			_attributes[attribute] = value;
			break;
		}
		
		case "stylesheet":
		{
			_attributes[attribute] = value;
			break;				
		}
		
		case "width":
		{
			if (value.substring (value.width.length, 3) == "%")
			{
				_attributes.widthType = "percent";
				_attributes.width = value.width.substring (0, value.width.length - 1)			
			}
			else
			{
				_attributes.widthType = "pixel";
				_attributes.width = value.width.substring (0, value.width.length - 2)
			}	
			break;			
		}
		
		case "appendTo":
		{
			_attributes[attribute] = value;	
			_attributes.appendTo.appendChild (_elements["container"]);			
			break;
		}			
		
		case "managed":
		{
			_attributes[attribute] = value;

			if (value)
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);		
			}
			else
			{
				window.addEvent (window, 'SUIREFRESH', refresh);
			}

			break;
		}
		
		case "canScroll":
		{
			_attributes[attribute] = value;
		}

		case "title":
		{
			_attributes[attribute] = value;
			refresh ();
			break;
		}

		case "icon":
		{
			_attributes[attribute] = value;
			break;
		}
				
		default:
		{
			throw "No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
}										