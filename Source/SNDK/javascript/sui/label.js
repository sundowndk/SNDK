// -------------------------------------------------------------------------------------------------------------------------
// label ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 		id 				get
//		tag				get/set
//		name			get/set
//		stylesheet		get/set
//		appendTo		get/set
//		managed			get/set
//		width			get/set
//		height			get
//		disabled		get/set
//		text			get/set
//
/**
 * @constructor
 */
label : function (attributes)
{	
	var _elements = new Array ();
	var _attributes = attributes;
			
	var _temp = { initialized: false,
			  	  cache: new Array ()
				};
			
	_attributes.id = SNDK.tools.newGuid ()	
					
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
		
	//	_attributes.heightType = "pixel";
	//	_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";
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
																		
		// Hook Events
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
			}
			else
			{
				_elements["container"].className = _attributes.stylesheet;
			}	
				
			_elements["text"].innerHTML = _attributes.text;
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
//			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
//			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
//			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["center"]);			
		}
		
		_temp.cacheUpdated = true;	
	}

	// -------------------------------------
	// setAttributes
	// -------------------------------------
	function setAttributes ()
	{								
		// Name
		if (!_attributes.name)		
			_attributes.name = "";	

		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "SUILabel";		

		// Managed
		if (!_attributes.managed)		
			_attributes.managed = false;	
	
		// Width
		if (!_attributes.width) 
			_attributes.width = "100px";				
			
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

		// Disabled
		if (!_attributes.disabled)		
			_attributes.disabled = false;				
													
		// Text
		if (!_attributes.text)
			_attributes.text = "";						
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
			
			case "name":
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

			case "text":
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
			
			case "name":
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
				throw "Attribute with name HEIGHT is ready only.";
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

			case "disabled":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}

			case "text":
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
	
	// ------------------------------------
	// Events
	// ------------------------------------
}
