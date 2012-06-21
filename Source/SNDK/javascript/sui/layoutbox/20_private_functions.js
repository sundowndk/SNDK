// ------------------------------------
// Private functions
// ------------------------------------
// ------------------------------------
// init
// ------------------------------------		
function init ()
{
	updateCache ();
}

// ------------------------------------
// construct
// ------------------------------------	
function construct ()
{
	// Container
	_elements["container"] = SNDK.tools.newElement ("div", {});
	_elements["container"].setAttribute ("id", _attributes.id);
														
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
	if (!_temp.cacheUpdated)
	{
		_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
		//_temp.cache["panelPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
	}
	
	_temp.cacheUpdated = true;	
}	
			
			
function getContainerHeight ()
{
	if (_temp.initialized)
	{
		return _elements["container"].style.container;
	}
	else
	{
		return 0;		
	}
}
			
// ------------------------------------
// setDefaultAttributes
// ------------------------------------					
function setAttributes ()
{
	// Stylesheet
	if (!_attributes.stylesheet) 
		_attributes.stylesheet = "SUILayoutbox";	

	// Managed
	if (!_attributes.managed)
		_attributes.managed = false;				

	// Width
	if (!_attributes.width) 
		_attributes.width = "100%";				
	
	if (_attributes.width == "content")
	{
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
					
	_attributes.panels = new Array ();							
}		
					
// ------------------------------------
// setDimensions
// ------------------------------------
function setDimensions ()
{		
	// Only set dimensions if control has been initalized
	if (_temp.initialized)
	{			
		var width = {};	
		var height = {};
		var combinedheightofchildren = 0;

		// Refresh all panels.
		for (i in _attributes.panels)
		{							
			//_attributes.panels[i].refresh ();
		}			

		// Find width.
		switch (_attributes.widthType.toLowerCase ())
		{
			case "content":
			{
				width.container = 0;
				for (i in _attributes.panels)
				{												
					if ((_attributes.panels[i]._attributes.sizeType == "pixel") || (_attributes.panels[i]._attributes.sizeType == "content"))
					{							
						console.log (_attributes.panels[i]._elements["container"].offsetWidth)
						console.log (_attributes.panels[i]._elements["container"].offsetHeight)
						if (width.container < _attributes.panels[i]._elements["container"].offsetWidth)					
						{
							width.container = _attributes.panels[i]._elements["container"].offsetWidth;							
						}							
					}
				}		
				break;
			}
			
			case "pixel":
			{
				width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
				break;
			}
			
			case "percent":
			{
				if (_attributes.managed)
				{
					width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
				}
				else
				{
					width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
				}
				break;
			}
		}

		// Find height.
		switch (_attributes.heightType.toLowerCase ())
		{
			case "content":
			{
				height.container = 0;			
				for (i in _attributes.panels)
				{						
					if ((_attributes.panels[i]._attributes.sizeType == "pixel") || (_attributes.panels[i]._attributes.sizeType == "content"))
					{									
						height.container += _attributes.panels[i]._elements["container"].offsetHeight; 
					}
				}	
				break;
			}
		
			case "pixel":
			{
				height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
				break;
			}
			
			case "percent":
			{
				if (_attributes.managed)
				{
					height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
				}
				else
				{
					height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
				}
				break;
			}
		}
				
		// Set width & height.		
		_elements["container"].style.width = width.container +"px";				
		_elements["container"].style.height = height.container +"px"; 				
		
		
		
		var dynamics = new Array ();
		var combinedsize = 0;						

		for (index in _attributes.panels)
		{
			if (_attributes.panels[index]._attributes.hidden)
			{
				continue;
			}
			
			var size = 0;
			var panel = _attributes.panels[index];
							
			switch (_attributes.panels[index]._attributes.sizeType)
			{
				case "percent":
				{					
					if (_attributes.type == "horizontal")
					{
						size =  Math.floor ((height.container * panel._attributes.size) / 100);
					}
					else if (_attributes.type == "vertical")
					{
						size =  Math.floor ((width.container * panel._attributes.size) / 100);
					}											
					combinedsize += size;							
					break;
				}
				
				case "pixel":
				{
					size = panel._attributes.size;					
					combinedsize += size;					
					break;
				}				
				
				case "dynamic":
				{
					dynamics[dynamics.length] = index;

					continue;
				}						
			}

			_attributes.panels[index]._attributes.calculatedSize = size;											
		}
		
		if (_attributes.type == "horizontal")
		{	
			dynamicsize = Math.floor ((height.container - combinedsize) / dynamics.length);
		}
		else if (_attributes.type == "vertical")
		{
			dynamicsize = Math.floor ((width.container - combinedsize) / dynamics.length);
		}				
										
		for (index in dynamics)
		{
			_attributes.panels[dynamics[index]]._attributes.calculatedSize = dynamicsize;	
		}		
					
		for (index in _attributes.panels)
		{
			if (_attributes.panels[index]._attributes.hidden)
			{
				continue;
			}
		
			var panel = _attributes.panels[index];
			var dimensions = {};
			
			var e = _attributes.panels[index]._elements["container"];


			if (_attributes.type == "horizontal")
			{
				if (_attributes.widthType == "content")
				{
					var contentwidth = 0;				
					
					for (i in panel._temp.uiElements)
					{									
						if ((panel._temp.uiElements[i]._attributes.widthType == "pixel") || (panel._temp.uiElements[i]._attributes.widthType == "content"))
						{	
							//console.log ("BLA"+panel._temp.uiElements[i]._elements["container"].offsetWidth)		
													
							if (contentwidth < panel._temp.uiElements[i]._elements["container"].offsetWidth)
							{
								contentwidth = panel._temp.uiElements[i]._elements["container"].offsetWidth;
							}							
						}
					}				
					
					console.log ("d"+ contentwidth)
				
					dimensions.width = 600 - SNDK.tools.getElementStyledPadding (e)["horizontal"];
				}
				else
				{
					dimensions.width = width.container - SNDK.tools.getElementStyledPadding (e)["horizontal"];
				}			
				
				dimensions.height = _attributes.panels[index]._attributes.calculatedSize - SNDK.tools.getElementStyledPadding (e)["vertical"];
				dimensions.cssfloat = "none";
			}
			else if (_attributes.type == "vertical")
			{
				dimensions.width = _attributes.panels[index]._attributes.calculatedSize - SNDK.tools.getElementStyledPadding (e)["horizontal"];
				dimensions.height = height.container - SNDK.tools.getElementStyledPadding (e)["vertical"];
				dimensions.cssfloat = "left";				
			}	
			
			e.style.width = dimensions.width +"px";
			e.style.height = dimensions.height +"px";
			e.style.cssFloat = dimensions.cssfloat;
			
			var combinedheightofchildren = 0;
					
			if (panel._attributes.canScroll)
			{
				for (index in panel._temp.uiElements)
				{		
					if (panel._temp.uiElements[index]._attributes.heightType == "pixel")
					{									
						combinedheightofchildren += parseInt (panel._temp.uiElements[index]._attributes.height);
					}
				}						
			
				if (combinedheightofchildren > dimensions.height)
				{
					dimensions.width = dimensions.width - window.scrollbarWidth;
				}													
			}					
										
			for (index in panel._temp.uiElements)
			{
				//console.log (panel._elements["container"].scrollTop)
								
				var scroll = panel._elements["container"].scrollTop;
			
				if (panel._temp.uiElements[index]._attributes.widthType == "percent")
				{
					panel._temp.uiElements[index]._attributes.managedWidth = (dimensions.width * panel._temp.uiElements[index]._attributes.width) / 100;
				}
		
				if (panel._temp.uiElements[index]._attributes.heightType == "percent")
				{
					panel._temp.uiElements[index]._attributes.managedHeight = (dimensions.height * panel._temp.uiElements[index]._attributes.height) / 100;
				}
			
				panel._temp.uiElements[index].refresh ();
				
				panel._elements["container"].scrollTop = scroll;
			}								
		}		
	}
}				
					