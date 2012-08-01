// -------------------------------------------------------------------------------------------------------------------------
// Canvas ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .refresh ()
// .dispose ()
// .addUIElement (uiElement);
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	id 			get
//	tag			get/set
//	stylesheet	get/set
//	width		get/set
//	height		get/set
//	canScroll	get/set
//
/**
 * @constructor
 */
canvas : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;				
	
	var _temp = 	{ 
						initialized: false,
			  			uiElements: new Array ()
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
	this.addUIElement = functionAddUIElement;
	this.getUIElement = functionGetUIElement;
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
		if (!SNDK.debugStopRefresh)
		{
		// Only refresh if control has been initalized.	
		if (_temp.initialized)
		{
			_elements["container"].className = _attributes.stylesheet;
		}
		
		setDimensions ();
		}
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
			var combinedheightofchildren = 0;

			switch (_attributes.widthType.toLowerCase ())
			{
				case "content":
				{
					width.container = 0;
					
					for (i in _temp.uiElements)
					{		
						if (_temp.uiElements[i]._attributes.widthType == "pixel")
						{				
							if (width.container < parseInt (_temp.uiElements[index]._attributes.width))					
							{
								width.container = parseInt (_temp.uiElements[index]._attributes.height);
							}							
						}
					}									
				
					break;
				}
				
				case "pixel":
				{
					width = _attributes.width;
					break;
				}
				
				case "percent":
				{
					width = (SNDK.tools.getElementInnerWidth (parent) * _attributes.width) / 100;
					break;
				}
			}

			switch (_attributes.heightType.toLowerCase ())
			{
				case "content":
				{
					height.container = 0;
				
					for (i in _temp.uiElements)
					{		
						if (_temp.uiElements[i]._attributes.heightType == "pixel")
						{									
							height.container += parseInt (_temp.uiElements[index]._attributes.height);		
						}
					}									
					break;
				}
			
				case "pixel":
				{
					height = _attributes.height;
					break;
				}
				
				case "percent":
				{
					height = (SNDK.tools.getElementInnerHeight (parent) * _attributes.height) / 100;
					break;
				}
			}
						
												
																								
//			if (_attributes.widthType == "percent")
//			{
//				width = (SNDK.tools.getElementInnerWidth (parent) * _attributes.width) / 100;
//			}
//			else if (_attributes.widthType == "content")
//			{
//				var contentwidth = 0;
//				
//				if (_temp.uiElements[index]._attributes.widthType == "pixel")
//				{													
//					contentwidth += parseInt (_temp.uiElements[index]._attributes.width);
//				}							
//													
//				width.container = contentwidth;
//			}
//			else
//			{
//				width = _attributes.width;
//			}
//					
//			if (_attributes.heightType == "percent")
//			{	
//				height = (SNDK.tools.getElementInnerHeight (parent) * _attributes.height) / 100;
//			}
//			else if (_attributes.heightType == "content")
//			{
//				var contentheight = 0;
//				
//				if (_temp.uiElements[index]._attributes.heightType == "pixel")
//				{													
//					contentheight += parseInt (_temp.uiElements[index]._attributes.height);
//				}							
//					
//				console.log (contentheight)
//					
//				height.container = contentheight;
//			}
//			else
//			{					
//				height = _attributes.height;
//			}
			
			_elements["container"].style.width = width +"px";
			_elements["container"].style.height = height +"px";

			if (_attributes.canScroll)
			{
				for (index in _temp.uiElements)
				{		
					if (_temp.uiElements[index]._attributes.heightType == "pixel")
					{									
						combinedheightofchildren += parseInt (_temp.uiElements[index]._attributes.height);
					}
				}						
			
				if (combinedheightofchildren > height)
				{
					width = width - window.scrollbarWidth;
				}			
			}						
			
			for (index in _temp.uiElements)
			{
				if (_temp.uiElements[index]._attributes.widthType == "percent")
				{
					
				
					_temp.uiElements[index]._attributes.managedWidth = (width * _temp.uiElements[index]._attributes.width) / 100;
					
					
				}
				
				if (_temp.uiElements[index]._attributes.heightType == "percent")
				{
					_temp.uiElements[index]._attributes.managedHeight = (height * _temp.uiElements[index]._attributes.height) / 100;
				}
				
				_temp.uiElements[index].refresh ();
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

	// ------------------------------------
	// Events
	// ------------------------------------		
}