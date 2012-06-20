// ------------------------------------
// Private functions
// ------------------------------------
// ------------------------------------
// init
// ------------------------------------	
function init ()
{
}

// ------------------------------------
// construct
// ------------------------------------	
function construct ()
{
	// Container
	_elements["container"] = SNDK.tools.newElement ("div", {});
	_elements["container"].setAttribute ("id", _attributes.id);
	
	if (_attributes.canScroll)
	{
		_elements["container"].style.overflow = "auto";		
	}		
	else
	{
		_elements["container"].style.overflow = "hidden";		
	}
																
	// Hook Events
	window.addEvent (window, 'SUIREFRESH', refresh);	
}	
	
// ------------------------------------
// refresh
// ------------------------------------		
function refresh ()
{	
	// Only refresh if control has been initalized.	
	if (_temp.initialized)
	{
		_elements["container"].className = _attributes.stylesheet;
	}
	
	setDimensions ();
}

// ------------------------------------
// refresh
// ------------------------------------			
function dispose ()
{
	window.removeEvent (window, 'SUIREFRESH', refresh);				
}
			
// ------------------------------------
// setDefaultAttributes
// ------------------------------------					
function setAttributes ()
{
	// Id
	_attributes.id = SNDK.tools.newGuid ();

	// Stylesheet
	if (!_attributes.stylesheet) _attributes.stylesheet = "SUICanvas";	
	
	// Managed
	if (!_attributes.managed)
		_attributes.managed = false;				

	// Width
	if (!_attributes.width) 
		_attributes.width = "100%";				
	
	if (_attributes.width == "content")
	{
		_attributes.width = 0;
		_attributes.widthType = "content";
	}			
	else if (_attributes.width.substring (_attributes.width.length - 1) == "%")
	{
		_attributes.widthType = "percent";
		_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
	}
	else
	{
		_attributes.widthType = "pixel";
		_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
	}		
	
	// Height
	if (!_attributes.height) 
		_attributes.height = "100%";
	
	if (_attributes.height == "content")
	{
		_attributes.height = 0;
		_attributes.heightType = "content";
	}
	else if (_attributes.height.substring (_attributes.height.length - 1) == "%")
	{
		_attributes.heightType = "percent";
		_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
	}
	else
	{
		_attributes.heightType = "pixel";
		_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
	}
					
	if (!_attributes.canScroll) 
		_attributes.canScroll = false;
}		
					
// ------------------------------------
// setDimensions
// ------------------------------------
function setDimensions ()
{		
	// Only set dimensions if control has been initalized.	
	if (_temp.initialized)
	{	
		var parent = _elements["container"].parentNode;			
		var width = 0;
		var height = 0;
		
		// Refresh all child elements.
		for (index in _temp.uiElements)
		{		
			_temp.uiElements[index].refresh ();
		}			
									
		// Find width.
		switch (_attributes.widthType.toLowerCase ())
		{
			// Width is content.
			case "content":
			{
				width = 0;			
				for (i in _temp.uiElements)
				{																		
					if ((_temp.uiElements[i]._attributes.widthType == "pixel") || (_temp.uiElements[i]._attributes.widthType == "content"))
					{	
						if (width < _temp.uiElements[i]._elements["container"].offsetWidth)
						{
							width = _temp.uiElements[i]._elements["container"].offsetWidth;
						}							
					}
				}																				
				break;
			}
			
			// Width is in pixels.
			case "pixel":
			{
				width = _attributes.width;
				break;
			}
			
			// Width is percent.
			case "percent":
			{
				width = (SNDK.tools.getElementInnerWidth (parent) * _attributes.width) / 100;
				break;
			}
		}

		// Find height.
		switch (_attributes.heightType.toLowerCase ())
		{
			// Height is content.
			case "content":
			{
				height = 0;						
				for (i in _temp.uiElements)
				{							
					if ((_temp.uiElements[i]._attributes.heightType == "pixel") || (_temp.uiElements[i]._attributes.heightType == "content"))
					{						
						height += _temp.uiElements[i]._elements["container"].offsetHeight;
					}
				}									
				break;
			}
		
			// Height is in pixels.
			case "pixel":
			{
				height = _attributes.height;
				break;
			}
			
			// Height is in percent.
			case "percent":
			{
				height = (SNDK.tools.getElementInnerHeight (parent) * _attributes.height) / 100;
				break;
			}
		}
		
		// Set width & height.
		_elements["container"].style.width = width +"px";
		_elements["container"].style.height = height +"px";

		// If canvas can scroll, we need to make room for the scrollbar.		
		if ((_attributes.canScroll) && (_attributes.heightType.toLowerCase () != "content"))
		{
			var contentheight = 0;			
			for (i in _temp.uiElements)
			{		
				if (_temp.uiElements[i]._attributes.heightType == "pixel" || _temp.uiElements[i]._attributes.heightType == "content")
				{									
					contentheight += parseInt (_temp.uiElements[i]._attributes.height);
				}
			}						
		
			if (contentheight > height)
			{
				width = width - window.scrollbarWidth;
			}			
		}						
		
		// All child elements that use percentage needs to have their width and height updated accordingly.
		for (i in _temp.uiElements)
		{
			var refresh = false;			
			if (_temp.uiElements[i]._attributes.widthType == "percent")
			{
				_temp.uiElements[i]._attributes.managedWidth = (width * _temp.uiElements[i]._attributes.width) / 100;
				refresh = true;
			}
			
			if (_temp.uiElements[i]._attributes.heightType == "percent")
			{
				_temp.uiElements[i]._attributes.managedHeight = (height * _temp.uiElements[i]._attributes.height) / 100;
				refresh = true;
			}
			
			if (refresh)
			{
				_temp.uiElements[i].refresh ();
			}
		}
	}
}	

// ------------------------------------
// addUIElement
// ------------------------------------							
function addUIElement (element)
{
 	_temp.uiElements[_temp.uiElements.length] = element;
 		 	
 	element.setAttribute ("managed", true);
 	element.setAttribute ("appendTo", _elements["container"]);
}

// ------------------------------------
// getUIElement
// ------------------------------------							
function getUIElement (tag)
{
	for (i in _temp.uiElements)
	{
		if (_temp.uiElements[i].getAttribute ("tag") == tag)
		{
			return _temp.uiElements[i];	
		}
	}
	
	throw ("No element with tag '"+ tag +"' was found in this canvas.");
}