// -------------------------------------------------------------------------------------------------------------------------
// Container ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .addUIElement (element)
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 		id 				get
//		tag				get/set
//		stylesheet		get/set
//		width			get/set
//		height			get/set
//		appendTo		get/set
//		managed			get/set
//		canScroll		get/set
//		title			get/set
//		icon			get/set
//
/**
 * @constructor
 */
container : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;				
	var _temp = 	{ initialized: false,
			  uiElements: new Array (),
			  cache: new Array (),
			  calculatedWidth: 0,
			  calculatedHeight: 0	 
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
	this.dispose = functionDispose;
	this.addTitleBarUIElement = functionAddTitleBarUIElement;
	//this.getTitleBarUIElement = funcitonGetTitleBarUIElement;
	this.addUIElement = functionAddUIElement;
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
													
		// Top
		_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});

		// TopLeft
		_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
			
		// TopCenter
		_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
		_elements["topcenter"].style.overflow = "hidden";
		
		// Titlebar
		_elements["titlebar"] = SNDK.tools.newElement ("div", {className: "TitleBar", appendTo: _elements["topcenter"]});
							
		// TopRight
		_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});
											
		// Content
		_elements["content"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["content"].style.clear = "both";			
			
		// ContentLeft
		_elements["contentleft"] = SNDK.tools.newElement ("div", {className: "ContentLeft", appendTo: _elements["content"]});
					
		// ContentCenter
		_elements["contentcenter"] = SNDK.tools.newElement ("div", {className: "ContentCenter", appendTo: _elements["content"]});		
		if (_attributes.canScroll)
		{
			_elements["contentcenter"].style.overflow = "auto";		
		}		
		else
		{
			_elements["contentcenter"].style.overflow = "hidden";		
		}		
																												
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

		// Icon	
		_elements["icon"] = SNDK.tools.newElement ("div", {className: "Icon", appendTo: _elements["topcenter"]});
						
		// Title	
		_elements["title"] = SNDK.tools.newElement ("div", {className: "Title", appendTo: _elements["topcenter"]});	
		SNDK.tools.textSelectionDisable (_elements["title"]);													
		
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
			if (_attributes.icon != "")
			{
				_elements["icon"].className = "Icon "+ _attributes.icon;
				_elements["icon"].style.display = "block";
			}
			else			
			{
				_elements["icon"].style.display = "none";
			}
			
			_elements["title"].innerHTML = _attributes.title;		
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
	
	function addTitleBarUIElement (type, attributes)
	{
		if (!attributes)
			attributes = new Array ();
			
		attributes.appendTo = _elements["titlebar"];
	
		switch (type.toUpperCase ())
		{
			case "BUTTON":
			{
				var count = _temp.uiElements.length;
		
	 			_temp.uiElements[count] = new SNDK.SUI.button (attributes);
	 				 			
	 			return _temp.uiElements[count];
	 		 		 			
				break;
			}						
		}
	}
		
	function getTitleBarUIElement (tag)
	{
	
	}
	
	// ------------------------------------
	// updateCache
	// ------------------------------------		
	function updateCache ()
	{
		if (!_temp.cacheUpdated)
		{
			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
			_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
		}
		
		_temp.cacheUpdated = true;	
	}			
				
	// ------------------------------------
	// setAttributes
	// ------------------------------------					
	function setAttributes ()
	{
		// Stylesheet
		if (!_attributes.stylesheet) 
			_attributes.stylesheet = "SUIContainer";	
			
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
		
		// canScroll
		if (!_attributes.canScroll) 
			_attributes.canScroll = false;
				
		// Icon
		if (!_attributes.icon) 
			_attributes.icon = "";
				
		// Title
		if (!_attributes.title) 
			_attributes.title = "";															
	
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
			var combinedheightofchildren = 0;
			
			// Refresh all child elements.
			for (index in _temp.uiElements)
			{							
				_temp.uiElements[index].refresh ();
			}			

			// Find width.
			switch (_attributes.widthType.toLowerCase ())
			{
				case "content":
				{
					width.container = 0;				
					for (i in _temp.uiElements)
					{								
						if ((_temp.uiElements[i]._attributes.widthType == "pixel") || (_temp.uiElements[i]._attributes.widthType == "content"))
						{											
							if (width.container < _temp.uiElements[i]._elements["container"].offsetWidth)					
							{
								width.container = _temp.uiElements[i]._elements["container"].offsetWidth + _temp.cache.containerWidth;
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
						swidth.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
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
				
					for (i in _temp.uiElements)
					{		
						if ((_temp.uiElements[i]._attributes.heightType == "pixel") || (_temp.uiElements[i]._attributes.heightType == "content") )
						{									
							height.container += _temp.uiElements[i]._elements["container"].offsetHeight + _temp.cache.containerHeight; 
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
			width.topCenter = width.container - _temp.cache.containerWidth;
			width.contentCenter = width.container - _temp.cache.containerWidth;
			width.bottomCenter = width.container - _temp.cache.containerWidth; 
			width.child = width.container - _temp.cache.containerWidth;

			height.contentLeft = height.container - _temp.cache.containerHeight;
			height.contentCenter = height.container - _temp.cache.containerHeight;
			height.contentRight = height.container - _temp.cache.containerHeight; 
			height.child = height.container - _temp.cache.containerHeight;
			
			_elements["container"].style.width = width.container + "px";
			_elements["topcenter"].style.width = width.topCenter + "px";
			_elements["contentcenter"].style.width = width.contentCenter + "px";
			_elements["bottomcenter"].style.width = width.bottomCenter +"px";							
			
			_elements["container"].style.height = height.container +"px";
			_elements["contentleft"].style.height = height.contentLeft +"px";
			_elements["contentcenter"].style.height = height.contentCenter +"px";			
			_elements["contentright"].style.height = height.contentRight +"px";			
						
			// If canvas can scroll, we need to make room for the scrollbar.		
			if ((_attributes.canScroll) && (_attributes.heightType.toLowerCase () != "content"))
			{
				var contentheight = 0;
				for (index in _temp.uiElements)
				{		
					if (_temp.uiElements[index]._attributes.heightType == "pixel")
					{									
						contentheight += parseInt (_temp.uiElements[index]._attributes.height);
					}
				}						
			
				if (contentheight > height.child)
				{
					width.child = width.child - window.scrollbarWidth;
				}			
			}	
					
			// All child elements that use percentage needs to have their width and height updated accordingly.
			for (index in _temp.uiElements)
			{
				var refresh = false;			
				if (_temp.uiElements[index]._attributes.widthType == "percent")
				{
					_temp.uiElements[index]._attributes.managedWidth = (width.child * _temp.uiElements[index]._attributes.width) / 100;
					refresh = true;
				}
				
				if (_temp.uiElements[index]._attributes.heightType == "percent")
				{
					_temp.uiElements[index]._attributes.managedHeight = (height.child * _temp.uiElements[index]._attributes.height) / 100;
					refresh = true;
				}
				
				if (refresh)
				{
					_temp.uiElements[index].refresh ();
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
					
	// ------------------------------------
	// Events
	// ------------------------------------					
}