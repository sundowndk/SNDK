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

function newPanel (attributes)
{
	var _attributes = attributes;
	var _elements = new Array ();
	var _temp =	{ uiElements: new Array (),
				contentHeight: 0,
				parent: null
			}

	setAttributes ();
	
	// Private functions		
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;

	// Functions						
	this.addUIElement = functionAddUIElement;
	this.getContentElement = functionGetContentElement;	
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;
	this.refresh = refresh ();

	// Initialize
	construct ();
	
	// ------------------------------------
	// Private functions
	// ------------------------------------
	function construct ()
	{
		_elements["container"] = SNDK.tools.newElement ("div", {className: "Panel", appendTo: _attributes.appendTo});
		
		
		if (_attributes.hidden)
		{
			_elements["container"].style.display = "none";
		}
								
		if (_attributes.canScroll)
		{
		
			_elements["container"].style.overflow = "auto";		
		}		
		else
		{
			//_elements["container"].style.overflow = "hidden";		
		}
	}
	
	function refresh ()
	{
		if (_attributes.parent._temp.initialized)
		{			
		if (_attributes.hidden)
		{
			_elements["container"].style.display = "none";
		}
		else
		{
			_elements["container"].style.display = "block";							
		}	
		}
		setDimensions ();
	}
	
	function setDimensions ()
	{
	if (_attributes.parent._temp.initialized)
	{			
		if (_attributes.type == "horizontal")
		{
			_elements["container"].style.width = SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) +"px";
		}
		else if (_attributes.type == "vertical")
		{
			_elements["container"].style.height = SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) +"px";
		}
		}
	}
	
	// ------------------------------------
	// setAttributes
	// ------------------------------------																
	function setAttributes ()
	{
		if (!_attributes.hidden) 
			_attributes.hidden = false;
			
		if (!_attributes.size) 
			_attributes.size = "*";	

		if (_attributes.size != "*")
		{							
			if (_attributes.size.substring (_attributes.size.length - 1) == "%")
			{
				_attributes.sizeType = "percent";
				_attributes.size = parseInt (_attributes.size.substring (0, _attributes.size.length - 1));	
			}
			else
			{
				_attributes.sizeType = "pixel";
				_attributes.size = parseInt (_attributes.size.substring (0, _attributes.size.length - 2));
			}									
		}
		else
		{
			_attributes.sizeType = "dynamic";
		}
	}

	// ------------------------------------
	// Public functions
	// ------------------------------------				
	// ------------------------------------
	// addUIElement
	// ------------------------------------																
	function functionAddUIElement (element)
	{
		var count = _temp.uiElements.length;

	 	_temp.uiElements[count] = element;
	 	element.setAttribute ("managed", true);
	 	element.setAttribute ("appendTo", _elements["container"]);
	 	
	 	_temp.contentHeight += parseInt (element.height); 		 	
						 	
	//  SNDK.SUI.refresh ();		 			 	 
	}	
	
	function functionGetContentElement ()
	{
		return _elements["container"];		
	}
	
	// ------------------------------------
	// getAttribute
	// ------------------------------------						
	function functionGetAttribute (attribute)
	{
		switch (attribute)
		{			
			case "tag":
			{
				return _attributes[attribute];
			}
			
			case "hidden":
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
			case "tag":
			{
				_attributes[attribute] = value;
				break;
			}
			
			case "hidden":
			{
				_attributes[attribute] = value;				
				refresh ();
				break;
			}
	
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}								
}

// ------------------------------------
// addPanel
// ------------------------------------						
function functionAddPanel (attributes)
{
	var count = _attributes.panels.length;
	attributes.appendTo = _elements["container"];
	attributes.parent = this;

	_attributes.panels[count] = new newPanel (attributes);
								
	refresh ();	
}

// ------------------------------------
// getPanel
// ------------------------------------						
function functionGetPanel (tag)
{
	for (index in _attributes.panels)
	{		
		if (_attributes.panels[index].getAttribute ("tag") == tag)
		{
			return _attributes.panels[index];
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

		case "height":
		{
			if (value.substring (value.height.length, 3) == "%")
			{
				_attributes.heightType = "percent";
				_attributes.height = value.height.substring (0, value.height.length - 1)			
			}
			else
			{
				_attributes.heightType = "pixel";
				_attributes.height = value.height.substring (0, value.height.length - 2)
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
							
		default:
		{
			throw "No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
}										
