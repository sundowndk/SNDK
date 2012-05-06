// -------------------------------------------------------------------------------------------------------------------------
// layoutbox ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .addPanel ({tag, size})
// .getPanel (tag)
//
//	.addUIElement (uielement)
//	.getAttribute (string)
//	.setAttribute (string, string)
//
//		tag		get/set
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
//	id		get
//	tag		get/set
//	stylesheet	get/set
//	width		get/set
//	height		get/set
//	appendTo	get/set			
//	managed		get/set
//
// CHANGELOG:
//
// v1.01:
//	- Added managed mode.
//	- Fixed panel render, should now be more accurate and faster.
//
// v1.00:
//	- Initial release.

/**
 * @constructor
 */
layoutbox : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;
	var _temp = 	{ initialized: false,
		 	  cache: new Array ()		 
			};

	_attributes.id = SNDK.tools.newGuid ();
	
	setAttributes ();	
	
	// Private functions
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;	
	this._init = init;	
	
	// Functions		
	this.refresh = functionRefresh;	
	this.addPanel = functionAddPanel;
	this.getPanel = functionGetPanel;		
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;

	// Construct
	construct ();
								
	// Initialize
	SNDK.SUI.addInit (this);
		
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
		
		// Height
		if (!_attributes.height) 
			_attributes.height = "100%";
			
		if (_attributes.height.substring (_attributes.height.length - 1) == "%")
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
		if (_temp.initialized)
		{			
			var width = {};	
			var height = {};
			var combinedheightofchildren = 0;

			if (!_attributes.managed && _attributes.widthType != "pixel")
			{					
				width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
			}
			else
			{			
				if (_attributes.managed && _attributes.widthType == "percent")
				{

					width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
				}
				else
				{
					width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
				}			
			}	

			if (!_attributes.managed && _attributes.heightType != "pixel")
			{					
				height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
			}
			else
			{			
				if (_attributes.managed && _attributes.heightType == "percent")
				{
					height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
				}
				else
				{
					height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
				}			
			}	
			
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
					dimensions.width = width.container - SNDK.tools.getElementStyledPadding (e)["horizontal"];
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
	
	function newPanel (attributes)
	{
		var _attributes = attributes;
		var _elements = new Array ();
		var _temp =	{ uiElements: new Array ()
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
					
	// ------------------------------------
	// Events
	// ------------------------------------					
}