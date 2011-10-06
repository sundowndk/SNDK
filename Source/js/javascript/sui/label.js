// -------------------------------------------------------------------------------------------------------------------------
// label ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	.id 		get
//	.tag		get/set
//	.stylesheet	get/set
//	.disabled	get/set
//	.text		get/set
//
// CHANGELOG:
//
// v1.00:
//	- Initial release.
/**
 * @constructor
 */
label : function (attributes)
{	
	var _elements = new Array ();
			
	var _attributes = attributes;				
	_attributes.id = SNDK.tools.newGuid ();				
	setAttributes ();
	
	var _temp = 	{ initialized: false,		 			
			}	
				
	// Functions
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;	
									
	// Construct
	construct ();
				
	// Init Control
	window.onDomReady (init);				
	
	// ------------------------------------
	// Private functions
	// ------------------------------------
	// ------------------------------------
	// init
	// ------------------------------------
	function init ()
	{
		if (typeof (_attributes.appendTo) == "string")
		{					
			_attributes.appendTo = document.getElementById (_attributes.appendTo);
		}		

		_attributes.appendTo.appendChild (_elements["container"])

		_temp.initialized = true;
		refresh ();		
	}

	// ------------------------------------
	// construct
	// ------------------------------------	
	function construct ()
	{								
		// Container
		_elements["container"] = SNDK.tools.newElement ("div", {});
		_elements["container"].setAttribute ("id", _attributes.id);		
			
		// Text
		_elements["text"] = SNDK.tools.newElement ("div", {className: "Text", appendTo: _elements["container"]});
			
		window.addEvent (window, 'resize', setDimensions);
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
				_elements["container"].removeAttribute("tabIndex");
				_attributes.focus = false;
				eventOnBlur ();				
			}
			else
			{
				_elements["container"].className = _attributes.stylesheet;
			}	
				
			_elements["text"].innerHTML = _attributes.text;
		}
		
		setDimensions ();
	}	

	// -------------------------------------
	// setAttributes
	// -------------------------------------
	function setAttributes ()
	{				
		// Stylesheet
		if (_attributes.stylesheet == null)
			_attributes.stylesheet = "SUILabel";			
								
		// Width
		if (!_attributes.width) _attributes.width = "100px";			
		if (_attributes.width.substring (_attributes.width.length, 3) == "%")
		{
			_attributes.widthType = "percent";
			_attributes.width = _attributes.width.substring (0, _attributes.width.length-1)			
		}
		else
		{
			_attributes.widthType = "pixel";
			_attributes.width = _attributes.width.substring (0, _attributes.width.length-2)
		}				

		// Text
		if (_attributes.text == null)
			_attributes.label = "TEXT";	
	
		// Disabled
		if (_attributes.disabled == null)
			_attributes.disabled = false;					
	}
		
	// -------------------------------------
	// setDimensions
	// -------------------------------------
	function setDimensions ()
	{
		if (_temp.initialized)
		{
			var containerwidth = 0;
		
			if (_attributes.widthType == "percent")
			{								
				setTimeout (	function () 
						{	
							var parentwidth = SNDK.tools.getElementInnerWidth (_elements["container"].parentNode);	
							var width = parentwidth - SNDK.tools.getElementStyledPadding (_elements["container"])["horizontal"] - containerwidth +"px";
													
							_elements["text"].style.width = width;
						}, 0);						
			}
			else
			{
				var width = _attributes.width  - containerwidth +"px";

				_elements["container"].style.width = _attributes.width +"px";
				_elements["text"].style.width = width;
			}		
		}
	}
	
	// ------------------------------------
	// Public functions
	// ------------------------------------
	// ------------------------------------
	// getAttribute
	// ------------------------------------						
	function functionGetAttribute (attribute)
	{
		if (!_attributes[attribute])
		{
			var result;
			
			// Some attributes are attentions whores.
			if (attribute == "width")
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
			if (attribute == "width" || attribute == "stylesheet" || attribute == "text")
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
							
	// ------------------------------------
	// Events
	// ------------------------------------
}
