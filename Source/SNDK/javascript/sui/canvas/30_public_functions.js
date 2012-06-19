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
				
// ------------------------------------
// addUIElement
// ------------------------------------							
function functionAddUIElement (element)
{
	var count = _temp.uiElements.length;
	
 	_temp.uiElements[count] = element;
 		 	
 	element.setAttribute ("managed", true);
 	element.setAttribute ("appendTo", _elements["container"]);
}

// ------------------------------------
// getUIElement
// ------------------------------------							
function functionGetUIElement (tag)
{
	for (index in _temp.uiElements)
	{
		if (_temp.uiElements[index].getAttribute ("tag") == tag)
		{
			return _temp.uiElements[index];	
		}
	}
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
			switch (_attributes.widthType.toLowerCase ())
			{
				case "content":
				{
					return "content";
				}
				
				case "pixel":
				{
					return _attributes.width + "px";						
				}
				
				case "percent":
				{
					return _attributes.width + "%";						
				}
			}			
		}
		
		case "height":
		{
			switch (_attributes.heightType.toLowerCase ())
			{
				case "content":
				{
					return "content";
				}
				
				case "pixel":
				{
					return _attributes.height + "px";						
				}
				
				case "percent":
				{
					return _attributes.height + "%";						
				}
			}						
		}
		
		case "canScroll":
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
			if (value == "content")
			{
				_attributes.widthType = "content";
				_attributes.width = "content";
			}			
			else if (value.substring (value.length, 3) == "%")
			{
				_attributes.widthType = "percent";
				_attributes.width = value.substring (0, value.length - 1)			
			}
			else
			{
				_attributes.widthType = "pixel";
				_attributes.width = value.substring (0, value.length - 2)
			}	
			
			refresh ();
			
			break;			
		}

		case "height":
		{
			if (value == "content")
			{
				_attributes.heightType = "content";
				_attributes.height = "content";
			}
			else if (value.substring (value.length, 3) == "%")
			{
				_attributes.heightType = "percent";
				_attributes.height = value.substring (0, value.length - 1)			
			}
			else
			{
				_attributes.heightType = "pixel";
				_attributes.height = value.substring (0, value.length - 2)
			}	
			
			refresh ();
			
			break;			
		}
		
		case "canScroll":
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