// -------------------------------------------------------------------------------------------------------------------------
// tabview ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .addTab ()
// .getTab ()
//
//	.addUIElement (uielement)
//	.getAttribute (string)
//	.setAttribute (string, string)
//
//		tag		get/set
//		selected	get/set
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	id 		get
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
//	- Fixed tab render, should be faster and work correctly on mobile devices.
//	- Fixed dimension calculation, now works correctly with percentage.
//	- Added managed mode.
//
// v1.00:
//	- Initial release.

/**
 * @constructor
 */
tabview : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;				
	var _temp = 	{ initialized: false,
			  selectedTab: -1,
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
	this.addTab = functionAddTab;
	this.getTab = functionGetTab;		
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
		_elements["container"].className = _attributes.stylesheet;
		
		// Tabs
		_elements["tabcontainer"] = SNDK.tools.newElement ("div", {className: "Tabs", appendTo: _elements["container"]});

		// Top
		_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});

		// TopLeft
		_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
			
		// TopCenter
		_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
		_elements["topcenter"].style.overflow = "hidden";
							
		// TopRight
		_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});
											
		// Content
		_elements["content"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["content"].style.clear = "both";			
			
		// ContentLeft
		_elements["contentleft"] = SNDK.tools.newElement ("div", {className: "ContentLeft", appendTo: _elements["content"]});
					
		// ContentCenter
		_elements["contentcenter"] = SNDK.tools.newElement ("div", {className: "ContentCenter", appendTo: _elements["content"]});		
		_elements["contentcenter"].style.overflow = "hidden";
																										
		// ContentRight
		_elements["contentright"] = SNDK.tools.newElement ("div", {className: "ContentRight", appendTo: _elements["content"]});
		
		// Bottom	
		_elements["bottom"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["bottom"].style.clear = "both";		
						
		// BottomLeft
		_elements["bottomleft"] = SNDK.tools.newElement ("div", {className: "BottomLeft", appendTo: _elements["bottom"]});	

		// BottomCenter
		_elements["bottomcenter"] = SNDK.tools.newElement ("div", {className: "BottomCenter", appendTo: _elements["bottom"]});
			
		// BottomRight
		_elements["bottomright"] = SNDK.tools.newElement ("div", {className: "BottomRight", appendTo: _elements["bottom"]});

		// TabButtons
		_elements["tabbuttons"] = new Array ();
															
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
		
		changeTab (_temp.selectedTab);
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
			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]));
			_temp.cache["containerHeight"] = (SNDK.tools.getElementStyledHeight (_elements["tabcontainer"]) + SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]));
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
			_attributes.stylesheet = "SUITabview";	
	
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
				
		_attributes.tabs = new Array ();
	}		
						
	// ------------------------------------
	// setDimensions
	// ------------------------------------
	function setDimensions ()
	{		
		// Only set dimensions if control has been initalized.	
		if (_temp.initialized)
		{	
			var width = {};
			var height = {};

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
			
			width.topCenter = width.container - _temp.cache.containerWidth;
			width.contentCenter = width.container - _temp.cache.containerWidth;
			width.bottomCenter = width.container - _temp.cache.containerWidth;
		
			height.contentLeft = height.container - _temp.cache.containerHeight;
			height.contentCenter = height.container - _temp.cache.containerHeight;
			height.contentRight = height.container - _temp.cache.containerHeight;
					
			_elements["container"].style.width = width.container +"px";
			_elements["topcenter"].style.width = width.topCenter +"px";
			_elements["contentcenter"].style.width = width.contentCenter +"px";		
			_elements["bottomcenter"].style.width = width.bottomCenter +"px";				

			_elements["container"].style.height = height.container +"px";
			_elements["contentleft"].style.height = height.contentLeft +"px";
			_elements["contentcenter"].style.height = height.contentCenter +"px";			
			_elements["contentright"].style.height = height.contentRight +"px";		
									
			for (index in _attributes.tabs)
			{
				var tab = _attributes.tabs[index];
				var e = _attributes.tabs[index]._elements["container"];
				
				var dimensions = {};
				
				dimensions.width = width.contentCenter - SNDK.tools.getElementStyledPadding (e)["horizontal"];
				dimensions.height = height.contentCenter - SNDK.tools.getElementStyledPadding (e)["vertical"];
				
				e.style.width = dimensions.width +"px";
				e.style.height = dimensions.height +"px";
				
				var combinedheightofchildren = 0;
						
				if (tab._attributes.canScroll)
				{
					for (index in tab._temp.uiElements)
					{		
						if (tab._temp.uiElements[index]._attributes.heightType == "pixel")
						{									
							combinedheightofchildren += parseInt (tab._temp.uiElements[index]._attributes.height);
						}
					}						
				
					if (combinedheightofchildren > dimensions.height)
					{
						dimensions.width = dimensions.width - window.scrollbarWidth;
					}			
				}											
							
				for (index in tab._temp.uiElements)
				{
					if (tab._temp.uiElements[index]._attributes.widthType == "percent")
					{
						tab._temp.uiElements[index]._attributes.managedWidth = (dimensions.width * tab._temp.uiElements[index]._attributes.width) / 100;
					}
			
					if (tab._temp.uiElements[index]._attributes.heightType == "percent")
					{
						tab._temp.uiElements[index]._attributes.managedHeight = (dimensions.height * tab. _temp.uiElements[index]._attributes.height) / 100;
					}
				
					tab._temp.uiElements[index].refresh ();
				}								
			}					
		}
	}	
				
	function changeTab (tab)
	{
		if (tab != _temp.selectedTab)
		{
			if (_temp.selectedTab > -1)
			{
				_elements["tabbuttons"][_temp.selectedTab].className = "TabButton";
				_attributes.tabs[_temp.selectedTab]._elements["container"].style.display = "none";
				
				//SNDK.tools. changeOpacityByObject (_attributes.tabs[_temp.selectedTab]._elements["container"], 0);
			}
						
			_elements["tabbuttons"][tab].className = "TabButton TabButtonSelected";
			_attributes.tabs[tab]._elements["container"].style.display = "block";
			//SNDK.tools. changeOpacityByObject (_attributes.tabs[tab]._elements["container"], 100);
						
			_temp.selectedTab = tab;
			
			//for (index in _attributes.tabs[_temp.selectedTab]._temp.uiElements)
			//{		
				//_attributes.tabs[_temp.selectedTab]._temp.uiElements[index].refresh ();
			//}	
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
	
	function newTab (attributes)
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
		this.setAttribute = functionSetAttribute;
		this.getAttribute = functionGetAttribute;

		// Initialize
		construct ();
		
		// ------------------------------------
		// Private functions
		// ------------------------------------
		function construct ()
		{
			_elements["container"] = SNDK.tools.newElement ("div", {className: "Tab", id: _attributes.id, appendTo: _attributes.appendTo});
			_elements["container"].style.position = "absolute";
			_elements["container"].style.zIndex = 0;		
			_elements["container"].style.display = "none";
			
			if (_attributes.canScroll)
			{
				_elements["container"].style.overflow = "auto";		
			}		
			else
			{
				_elements["container"].style.overflow = "hidden";		
			}			
		}
		
		// ------------------------------------
		// setAttributes
		// ------------------------------------																
		function setAttributes ()
		{
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
				
				case "selected":
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
		
				case "selected":
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
	// addTab
	// ------------------------------------						
	function functionAddTab (attributes)
	{
		var count = _attributes.tabs.length;
		attributes.appendTo = _elements["contentcenter"];
		attributes.id = _attributes.id +"-tab-"+ count;
		
		_attributes.tabs[count] = new newTab (attributes);

		_elements["tabbuttons"][count] = SNDK.tools.newElement ("div", {className: "TabButton", id: _attributes.id +"-button-"+ count ,appendTo: _elements["tabcontainer"]});
		_elements["tabbuttons"][count].onmousedown = eventOnClickTab;
		SNDK.tools.textSelectionDisable (_elements["tabbuttons"][count]);

		SNDK.tools.newElement ("div", {className: "Left", appendTo: _elements["tabbuttons"][count]});
		SNDK.tools.newElement ("div", {className: "Center", appendTo: _elements["tabbuttons"][count], innerHTML: attributes.label});	
		SNDK.tools.newElement ("div", {className: "Right", appendTo: _elements["tabbuttons"][count]});			
					
		if (attributes.selected)
		{
			changeTab (count)
		}						
										
		refresh ();	
	}	
	
	// ------------------------------------
	// getTab
	// ------------------------------------						
	function functionGetTab (tag)
	{
		for (index in _attributes.tabs)
		{		
			if (_attributes.tabs[index].getAttribute ("tag") == tag)
			{
				return _attributes.tabs[index];
			}
		}
		
		throw "No tab with tag '"+ tag +"' exist in this tabview";
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
					
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}																	
					
	// ------------------------------------
	// Events
	// ------------------------------------		
	function eventOnClickTab ()
	{
		changeTab (this.id.split ("-")[6]);
	}			
}