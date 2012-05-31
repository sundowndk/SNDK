// -------------------------------------------------------------------------------------------------------------------------
// image ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
//	.addItem (item) 
//
//	.refresh ()
//	.getAttribute (key)
//	.setAttribute (key, value)
//
//		id		get
//		tag		get/set
//		stylesheet	get/set
//		width		get/set
//		height		get/set
//		managed		get/set
//		appendTo	get/set
//		disabled	get/set
//		readOnly	get/set
//		focus		get/set
//		onFocus		get/set
//		onBlur		get/set
//		onChange	get/set
//
//
//
//
// .addItem (array)
// .removeItem (int)
// .moveItemUp ([int])
// .moveItemDowm ([int])
// .moveItemTo (int, int)
//
// .id ()
// .tag (string)
//
// .stylesheet (string)
// .widthType (string)
// .width (int)
// .heightType (string)
// .height (int)
//
// .focus (bool)
// .disabled (bool)
// .readOnly (bool)
//
// .items (array)
// .selectedIndex (int)
// .selectedItem ()
// .count ()
// .clear ()
//
// .onFocus (function)
// .onBlur (function)
// .onChange (function)
// -------------------------------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
image : function (attributes)
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
	this.dispose = functionDispose;
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;
	
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
		
//		if (_attributes.url != null)
//		{
//			var test = '<object width="100%" height="100%" id="foo" name="foo" type="text/html" data="http://www.w3schools.com/"></object>';
//		
//			_elements["contentcenter"].innerHTML = test;
//		}
//		else
//		{
//			_elements["contentcenter"].innerHTML = _attributes.content;
//		}
	}
	
	// ------------------------------------
	// contruct
	// ------------------------------------
	function construct ()
	{
		// Container
		_elements["container"] = SNDK.tools.newElement ("div", {});
		_elements["container"].setAttribute ("id", _attributes.id);		
		_elements["container"].className = _attributes.stylesheet;		
													
		// Top
		_elements["top"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);

		// TopLeft
		_elements["topleft"] = SNDK.tools.newElement ("div", "TopLeft", null, _elements["top"]);
			
		// TopCenter
		_elements["topcenter"] = SNDK.tools.newElement ("div", "TopCenter", null, _elements["top"]);
		_elements["topcenter"].style.overflow = "hidden";
						
		// TopRight
		_elements["topright"] = SNDK.tools.newElement ("div", "TopRight", null, _elements["top"]);
		
		// Content
		_elements["content"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
		_elements["content"].style.clear = "both";			
						
		// ContentLeft
		_elements["contentleft"] = SNDK.tools.newElement ("div", "ContentLeft", null, _elements["content"]);
					
		// ContentCenter
		_elements["contentcenter"] = SNDK.tools.newElement ("div", "ContentCenter", null, _elements["content"]);		
		_elements["contentcenter"].style.overflow = "hidden";
		
		// Render
		_elements["render"] = SNDK.tools.newElement ("img", {className: "Render", width: "100%", appendTo: _elements["contentcenter"]});						
		_elements["render"].src = _attributes.source;
		
		// ContentRight
		_elements["contentright"] = SNDK.tools.newElement ("div", "ContentRight", null, _elements["content"]);
		
		// Bottom	
		_elements["bottom"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
		_elements["bottom"].style.clear = "both";		
						
		// BottomLeft
		_elements["bottomleft"] = SNDK.tools.newElement ("div", "BottomLeft", null, _elements["bottom"]);	

		// BottomCenter
		_elements["bottomcenter"] = SNDK.tools.newElement ("div", "BottomCenter", null, _elements["bottom"]);
			
		// BottomRight
		_elements["bottomright"] = SNDK.tools.newElement ("div", "BottomRight", null, _elements["bottom"]);
			
		// Hook Events
		_elements["contentcenter"].onfocus = eventOnFocus;
		_elements["contentcenter"].onblur = eventOnBlur;
				
		window.addEvent (window, 'SUIREFRESH', refresh);			
	}	
		
	// ------------------------------------
	// refresh
	// ------------------------------------		
	function refresh ()
	{		
		if (_temp.initialized)
		{
			if (_attributes.disabled)
			{
				_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
				_elements["contentcenter"].removeAttribute("tabIndex");
				
				for (index in _elements["items"])
				{
					SNDK.tools.opacityChange (_elements["items"][index], 40);
				}				
			} 
			else
			{			
				_elements["container"].className = _attributes.stylesheet;
			}	
		}		

		setDimensions ();
	}
	
	function dispose ()
	{
		window.removeEvent (window, 'SUIREFRESH', refresh);	
	}
	
	function functionDispose ()
	{		
		dispose ();
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
	// setattributes
	// ------------------------------------		
	function setAttributes ()
	{				
		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "SUIImage";
				
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
				
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
			
		// Content
		if (!_attributes.content)
			_attributes.content = "";			
			
		// Source
		if (!_attributes.source)
			_attributes.source = "";
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
						
			width.topCenter = width.container - _temp.cache.containerWidth;
			width.contentCenter = width.container - _temp.cache.containerWidth;
			width.bottomCenter = width.container - _temp.cache.containerWidth;
			
			height.contentLeft = height.container - _temp.cache.containerHeight;
			height.contentCenter = height.container - _temp.cache.containerHeight;
			height.contentRight = height.container - _temp.cache.containerHeight;

			
			_elements["container"].style.width = width.container + "px";
			_elements["topcenter"].style.width = width.topCenter + "px";
			_elements["contentcenter"].style.width = width.contentCenter +"px";
			_elements["bottomcenter"].style.width = width.bottomCenter +"px";
						
			_elements["container"].style.height = height.container + "px";
			_elements["contentleft"].style.height = height.contentLeft + "px";
			_elements["contentcenter"].style.height = height.contentCenter +"px";
			_elements["contentright"].style.height = height.contentRight +"px";				
		}		
	}
	
	// ------------------------------------
	// setFocus
	// ------------------------------------				
	function setFocus ()
	{
		setTimeout ( function () { _elements["contentcenter"].focus (); }, 2);	
	}		
	
	
	
	
	// ------------------------------------
	// setSource
	// ------------------------------------				
	function setSource (source)
	{
		if (_temp.initialized)
		{
			_elements["render"].src = source;
		}
		else
		{
			_attributes.source = source;
		}
	}		
	
	// ------------------------------------
	// getSource
	// ------------------------------------				
	function getSource ()
	{
		if (_temp.initialized)
		{
			return _elements["render"].src;
		}
		else
		{
			return _attributes.source;
		}
	}		
		
	// ------------------------------------
	// Public functions
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
			
			case "source":
			{
				return getSource ();
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
			
			case "source":
			{
				setSource (value);
				break;
			}
								
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}										
					
	function functionDispose ()
	{
		dispose ();
	}							
											
	// ------------------------------------
	// Events
	// ------------------------------------					
	// ------------------------------------
	// onFocus
	// ------------------------------------					
	function eventOnFocus ()
	{
		if (!_attributes.disabled)
		{
			if (!_attributes.focus)
			{
				_attributes.focus = true;
				refresh ();

				if (_attributes.onFocus != null)
				{
					setTimeout( function ()	{ _attributes.onFocus (); }, 1);
				}			
			}				
		}
	}

	// ------------------------------------
	// onBlur
	// ------------------------------------							
	function eventOnBlur ()
	{
		if (!_attributes.disabled)
		{
			if (_attributes.focus)
			{	
				_attributes.focus = false;
				refresh ();

				if (_attributes.onBlur != null)
				{
					setTimeout( function ()	{ _attributes.onBlur (); }, 1);
				}			
			}	
		}
	}
}