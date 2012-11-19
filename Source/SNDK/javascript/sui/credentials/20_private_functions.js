// ------------------------------------
// Private functions
// ------------------------------------
function init ()
{
	updateCache ();

	_attributes.heightType = "pixel";
	_attributes.height = _temp.cache["containerBoxDimensions"]["vertical"] + _temp.cache["containerHeight"];				
			
	_elements["username"]._init ();
	_elements["password"]._init ();
}

// ------------------------------------
// construct
// ------------------------------------	
function construct ()
{					
	// Container									
	_elements["container"] = SNDK.tools.newElement ("ul", {});
	_elements["container"].className = _attributes.style +" "+ _attributes.color +"-input "+ _attributes.size;
					
	_elements["li1"] = SNDK.tools.newElement ("li", {appendTo: _elements["container"]});
	_elements["li2"] = SNDK.tools.newElement ("li", {appendTo: _elements["container"]});
			
	_elements["username"] = new SNDK.SUI.textbox ({appendTo: _elements["li1"], stylesheet: "input-unstyled", width: "100%", name: _attributes.username.name, placeholder: _attributes.username.placeholder, value: _attributes.username.value, icon: _attributes.username.icon });
	_elements["password"] = new SNDK.SUI.textbox ({appendTo: _elements["li2"], stylesheet: "input-unstyled", width: "100%", password: true, name: _attributes.username.name, placeholder: _attributes.password.placeholder, value: _attributes.password.value, icon: _attributes.password.icon });
	
	// Hook events			
	_elements["username"].setAttribute ("onFocus", eventOnFocus);
	_elements["username"].setAttribute ("onBlur", eventOnBlur);
	_elements["username"].setAttribute ("onChange", eventOnChange);
	_elements["username"].setAttribute ("onEnter", eventOnEnter);
	_elements["password"].setAttribute ("onFocus", eventOnFocus);				
	_elements["password"].setAttribute ("onBlur", eventOnBlur);
	_elements["password"].setAttribute ("onChange", eventOnChange);
	_elements["password"].setAttribute ("onEnter", eventOnEnter);
				
	window.addEvent (window, 'SUIREFRESH', refresh);			
}		

// ------------------------------------
// dispose
// ------------------------------------			
function dispose ()
{
	window.removeEvent (window, 'SUIREFRESH', refresh);				
}	

// ------------------------------------
// updateCache
// ------------------------------------		
function updateCache ()
{			
	_temp.cache = {};
	_temp.cache.containerBoxDimensions = SNDK.tools.getElementStyledBoxSize (_elements["container"]);					
	_temp.cache.containerHeight = SNDK.tools.getElementStyledHeight (_elements["container"]);
}	

// -------------------------------------
// setDimensions
// -------------------------------------
function setDimensions ()
{
	if (_temp.initialized)
	{	
		var width = 0;
	
		if (_attributes.widthType != "pixel")
		{								
			width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100)
		}
		else	
		{			
			width = _attributes.width;
		}		
	
		_elements["container"].style.width = width - _temp.cache.containerBoxDimensions.horizontal +"px";
		
		_elements["username"].refresh ();
		_elements["password"].refresh ();
	}
}
	
// ------------------------------------
// refresh
// ------------------------------------	
function refresh ()
{
	if (_temp.initialized)
	{
		var style = _attributes.style +" "+ _attributes.color +"-input "+ _attributes.size;
				
		if (_attributes.disabled)
		{
			style += " disabled";
		
			_elements["username"].setAttribute ("disabled", true);
			_elements["password"].setAttribute ("disabled", true);				
			
			_attributes.focus = false;
			eventOnBlur ();				
		}
		else
		{				
			if (_attributes.focus)
			{	
				style += " focus";
			}
			
			_elements["container"].tabIndex = _attributes.tabIndex;
		}
		
		// TabIndex
		if (_attributes.tabIndex != 0)
		{
			_elements["username"].setAttribute ("tabIndex", _attributes.tabIndex);
			_elements["password"].setAttribute ("tabIndex", _(attributes.tabIndex + 1));
		}

		_elements["container"].className = style;
	
		setDimensions ();
	}		
}	

// -------------------------------------
// setAttributes
// -------------------------------------
function setAttributes ()
{						
	// Id
	_attributes.id = SNDK.tools.newGuid ();
				
	// Style
	if (!_attributes.style)
		_attributes.style = "inputs";			
		
	// Width
	if (!_attributes.width) 
		_attributes.width = "100%";				
		
	if (_attributes.width.substring (_attributes.width.length - 1) == "%")
	{
		_attributes.widthType = "percent";
		_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
	}
	else
	{
		_attributes.widthType = "pixel";
		_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
	}						
																							
	// Disabled
	if (!_attributes.disabled)
		_attributes.disabled = false;		
		
	// Focus	
	if (!_attributes.focus)
		_attributes.focus = false;
		
	// TabIndex
	if (!_attributes.tabIndex)
		_attributes.tabIndex = 0;
		
	// Color
	if (!_attributes.color)
		_attributes.color = "";
		
	// Size
	if (!_attributes.size)
		_attributes.size =  "";
		
	// Username
	if (!_attributes.username)
		_attributes.username = {};
		
	// Username.Icon
	if (!_attributes.username.icon)
		_attributes.username.icon = "user;black";
					
	// Password					
	if (!_attributes.password)
		_attributes.password = {};			
		
	// Password.Icon
	if (!_attributes.password.icon)
		_attributes.password.icon = "lock;black";							
}

// ------------------------------------
// getAttribute
// ------------------------------------						
function getAttribute (attribute)
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
		
		case "style":
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
		
		case "disabled":
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
		
		case "onReady":
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
		
		case "username":
		{
			return _elements["username"].getAttribute ("value");
		}
		
		case "password":
		{
			return _elements["password"].getAttribute ("value");
		}
				
		default:
		{
			throw "BLA" +": No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
}

// ------------------------------------
// setAttribute
// ------------------------------------						
function setAttribute (attribute, value)
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
		
		case "style":
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
			throw this.type +": Attribute with name HEIGHT is ready only.";
			break;			
		}

		
		case "appendTo":
		{
			_attributes[attribute] = value;	
			_attributes.appendTo.appendChild (_elements["container"]);			
			break;
		}			
		
		case "disabled":
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
		
		case "onReady":
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
			break;
		}			
		
		case "username":
		{
			_elements["username"].setAttribute ("value", value);
			break;
		}
		
		case "password":
		{
			_elements["password"].setAttribute ("value", value);
			break;
		}
				
		default:
		{
			throw "BLA" +": No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
}				