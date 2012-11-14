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
		
		case "name":
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

		case "disabled":
		{
			return _attributes[attribute];			
		}

		case "autocomplete":
		{
			return _attributes[attribute];			
		}

		case "readOnly":
		{
			return _attributes[attribute];			
		}
				
		case "password":
		{
			return _attributes[attribute];			
		}
		
		case "textTransform":
		{
			return _attributes[attribute];			
		}
		
		case "focus":
		{
			return _attributes[attribute];			
		}

		case "onFocus":
		{
			return _attributes[attribute];			
		}

		case "onBlur":
		{
			return _attributes[attribute];			
		}

		case "onChange":
		{
			return _attributes[attribute];			
		}

		case "onKeyUp":
		{
			return _attributes[attribute];			
		}
		
		case "onEnter":
		{
			return _attributes[attribute];
		}

		case "tabIndex":
		{
			return _attributes[attribute];
		}

		case "value":
		{
			return getValue ();
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
		
		case "name":
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
		
		case "height":
		{
			throw "Attribute with name HEIGHT is ready only.";
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

		case "disabled":
		{
			_attributes[attribute] = value;
			refresh ();
			break;
		}

		case "autocomplete":
		{
			_attributes[attribute] = value;
			break;
		}

		case "readOnly":
		{
			_attributes[attribute] = value;
			refresh ();
			break;
		}
		
		case "password":
		{
			_attributes[attribute] = value;
			refresh ();
			break;
		}
		
		case "textTransform":
		{
			_attributes[attribute] = value;
			refresh ();
			break;
		}
		
		case "focus":
		{
			_attributes[attribute] = value;
			refresh ();
			break;
		}

		case "onFocus":
		{
			_attributes[attribute] = value;
			break;
		}

		case "onBlur":
		{
			_attributes[attribute] = value;
			break;
		}

		case "onChange":
		{
			_attributes[attribute] = value;
			break;
		}

		case "onKeyUp":
		{
			_attributes[attribute] = value;
			break;
		}
		
		case "onEnter":
		{
			_attributes[attribute] = value;
			break;
		}

		case "tabIndex":
		{
			_attributes[attribute] = value;
			refresh ();
		}

		case "value":
		{
			_attributes[attribute] = value;
			refresh ();
			if (_temp.initialized)
			{
				eventOnChange ();
			}
			break;
		}		
				
		default:
		{
			throw "No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
}
