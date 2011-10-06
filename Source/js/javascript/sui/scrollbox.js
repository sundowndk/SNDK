// -------------------------------------------------------------------------------------------------------------------------
// Scrollbox ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .addUIElement (uiElement);
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	.id 		get
//	.tag		get/set
//	.stylesheet	get/set
//	.width		get/set
//	.height		get/set
//
// CHANGELOG:
//
// v1.00:
//	- Initial release.

/**
 * @constructor
 */
scrollbox : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;				
	var _temp = 	{ initialized: false,
			  uiElements: new Array ()
			};
	
	_attributes.id = SNDK.tools.newGuid ();
	
	setAttributes ();	
	
	// Private functions
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;	
	
	// Functions		
	this.refresh = functionRefresh;		
	this.getContent = functionGetContent;
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;
	
	this.addUIElement = functionAddUIElement;

	// Construct
	construct ();
								
	// Initialize
	SNDK.SUI.addInit (this);
		
	// ------------------------------------
	// Private functions
	// ------------------------------------
	// ------------------------------------
	// construct
	// ------------------------------------	
	function construct ()
	{
		// Container
		_elements["container"] = SNDK.tools.newElement ("div", {});
		_elements["container"].setAttribute ("id", _attributes.id);
		_elements["container"].style.overflow = "auto";
																	
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
	// setDefaultAttributes
	// ------------------------------------					
	function setAttributes ()
	{
		// Stylesheet
		if (!_attributes.stylesheet) _attributes.stylesheet = "SUICanvas";	
	
		// Width
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
			
			if (_attributes.widthType == "percent")
			{
				width = (SNDK.tools.getElementInnerWidth (parent) * _attributes.width) / 100;
			}
			else
			{
				width = _attributes.width;
			}
					
			if (_attributes.heightType == "percent")
			{	
				height = (SNDK.tools.getElementInnerHeight (parent) * _attributes.height) / 100;
			}
			else
			{					
				height = _attributes.height;
			}
			
			_elements["container"].style.width = width +"px";
			_elements["container"].style.height = height +"px";
			
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
			
			for (index in _temp.uiElements)
			{
				if (_temp.uiElements[index]._attributes.widthType == "percent")
				{
					_temp.uiElements[index]._attributes.managedWidth = (width * _temp.uiElements[index]._attributes.width) / 100;
				}
				
				if (_temp.uiElements[index]._attributes.widthType == "percent")
				{
					_temp.uiElements[index]._attributes.mangedHeight = (height * _temp.uiElements[index]._attributes.height) / 100;
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
	// getContent
	// ------------------------------------						
	function functionGetContent ()
	{
		return _elements["container"];
	}
		
	// ------------------------------------
	// getAttribute
	// ------------------------------------						
	function functionGetAttribute (attribute)
	{
		if (!_attributes[attribute])
		{
			var result;
			
			// Some attributes are attentions whores.
			if (attribute == "width" || attribute == "height")
			{
				result = _attributes[attribute] + _attributes[attribute + "Type"];
			}
		
			return _attributes[attribute];
		}
		else
		{
			throw "No attribute with the name '"+ attribute +"' exist in this object";
		}
	}
	
	// ------------------------------------
	// setAttribute
	// ------------------------------------						
	function functionSetAttribute (attribute, value)
	{
		if (!_attributes[attribute])
		{
			// Some attributes is readonly.
			if (attribute == "id")
			{
				throw "Attribute with name '"+ attribute +"' is ready only.";
			}
				
			_attributes[attribute] == value;
			
			// Some attributes needs special threatment.						
			if (attribute == "width" || attribute == "height" || attribute == "stylesheet" || attribute == "title" || attribute == "icon")
			{
				setAttributes ();
				refresh ()
			}
		}
		else
		{
			throw "No attribute with the name '"+ attribute +"' exist in this object";
		}
	}	
	
	function functionAddUIElement (element)
	{
		var count = _temp.uiElements.length;
		
	 	_temp.uiElements[count] = element;
	 		 	
	 	element.setAttribute ("managed", true);
	 	element.setAttribute ("appendTo", _elements["container"]);
	}
					
	// ------------------------------------
	// Events
	// ------------------------------------		
}