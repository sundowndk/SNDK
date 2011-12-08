// -------------------------------------------------------------------------------------------------------------------------
// textbox ([attributes])
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
//		autoComplete	get/set
//		readOnly		get/set
//		focus			get/set
//		password		get/set
//		onFocus			get/set
//		onBlur			get/set
//		onChange		get/set
//		onKeyUp			get/set
//		value			get/set
//
/**
 * @constructor
 */
textbox : function (attributes)
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
		
		_attributes.heightType = "pixel";
		_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";		
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
							
		// Control Left			
		_elements["left"] = SNDK.tools.newElement ("div", {className: "Left", appendTo: _elements["container"]});
			
		// Control Center
		_elements["center"] = SNDK.tools.newElement ("div", {className: "Center", appendTo: _elements["container"]});

		// Control Right
		_elements["right"] = SNDK.tools.newElement ("div", {className: "Right", appendTo: _elements["container"]});
			
		// Control Input
		// FIXTHIS
		var type = "text";
		if (_attributes.password)
		{
			type = "password";
		}
		
		_elements["input"] = SNDK.tools.newElement ("input", {className: "Input", type: type, appendTo: _elements["center"]});
		_elements["input"].setAttribute ("name", _attributes.name);
															
		// Hook Events
		_elements["input"].onfocus = eventOnFocus;
		_elements["input"].onblur = eventOnBlur;
		_elements["input"].onchange = eventOnChange;
		_elements["input"].onkeyup = eventOnKeyUp;	
		
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
				_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Disabled";														
				_elements["input"].disabled = true;
				_attributes.focus = false;
				eventOnBlur ();					
			}
			else
			{
				if (_attributes.focus)
				{
					_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus";
					setFocus ();
				}
				else
				{
					_elements["container"].className = _attributes.stylesheet;
				}

				_elements["input"].disabled = false;
			}
				
			if (_attributes.autoComplete)
			{
				_elements["input"].setAttribute ("autocomplete", "on");
			}
			else
			{
				_elements["input"].setAttribute ("autocomplete", "off");
			}	
			
			if (_attributes.readOnly)
			{
				_elements["input"].setAttribute ("readonly", "true");
			}
			else
			{
				_elements["input"].removeAttribute ("readonly");
			}						
			
			if (_attributes.value != null)
			{
				_elements["input"].value = _attributes.value;
			}							
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
			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["center"]);
			_temp.cache["inputPadding"] = SNDK.tools.getElementStyledPadding (_elements["input"]);
		}
		
		_temp.cacheUpdated = true;	
	}		
		
	// ------------------------------------
	// setAttributes
	// ------------------------------------		
	function setAttributes ()
	{
		// Name
		if (!_attributes.name)		
			_attributes.name = "";	

		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "SUITextbox";		

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
													
		// AutoComplete
		if (!_attributes.autoComplete)
			_attributes.autoComplete = false;

		// ReadOnly
		if (!_attributes.readOnly)
			_attributes.readOnly = false;

		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
				
		// Password
		if (!_attributes.password)
			_attributes.password = false;

		// onFocus
		if (!_attributes.onFocus)
			_attributes.onFocus = null;	
			
		// onBlur
		if (!_attributes.onBlur)
			_attributes.onBlur = null;	

		// onChange
		if (!_attributes.onChange)
			_attributes.onChange = null;
								
		// Value
		if (!_attributes.value)
			_attributes.value = "";	
	}		
	
	// ------------------------------------	
	// setDimensions
	// ------------------------------------			
	function setDimensions ()
	{
		if (_temp.initialized)
		{	
			var width = {};
			
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
			
			width.center = width.container - _temp.cache.containerWidth;
			width.input = width.center - _temp.cache.inputPadding["horizontal"];

			_elements["container"].style.width = width.container +"px";
			_elements["center"].style.width = width.center +"px";
			_elements["input"].style.width = width.input +"px";
		}
	}	
				
	// ------------------------------------
	// setFocus
	// ------------------------------------				
	function setFocus ()
	{
		setTimeout ( function () { _elements["input"].focus ();	}, 2);	
	}	
		
	// ------------------------------------
	// keyHandler
	// ------------------------------------
	function keyHandler (event)
	{		
		var key;
		if (!event && window.event) 
		{
			event = window.event;
		}
			
		if (event) 
		{
			key = event.keyCode;
		}
		else
		{
			key = event.which;	
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

			case "disabled":
			{
				return _attributes[attribute];			
			}

			case "autocomplete":
			{
				return _attributes[attribute];			
			}

			case "readOnly":
			{
				return _attributes[attribute];			
			}
			
			case "focus":
			{
				return _attributes[attribute];			
			}

			case "password":
			{
				return _attributes[attribute];			
			}

			case "onFocus":
			{
				return _attributes[attribute];			
			}

			case "onBlur":
			{
				return _attributes[attribute];			
			}

			case "onChange":
			{
				return _attributes[attribute];			
			}

			case "onKeyUp":
			{
				return _attributes[attribute];			
			}

			case "value":
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

			case "autocomplete":
			{
				_attributes[attribute] = value;
				break;
			}

			case "readOnly":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}
			
			case "focus":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}

			case "password":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}

			case "onFocus":
			{
				_attributes[attribute] = value;
				break;
			}

			case "onBlur":
			{
				_attributes[attribute] = value;
				break;
			}

			case "onChange":
			{
				_attributes[attribute] = value;
				break;
			}

			case "onKeyUp":
			{
				_attributes[attribute] = value;
				break;
			}

			case "value":
			{
				_attributes[attribute] = value;
				refresh ();
				if (_temp.initialized)
				{
					eventOnChange ();
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
	// ------------------------------------		
	// ------------------------------------
	// onKeyUp
	// ------------------------------------	
	function eventOnKeyUp (event)
	{
		var result = true;
			
		result = keyHandler (event);				
				
		_attributes.value = _elements["input"].value;				
					
		if (_attributes.onKeyUp != null)
		{
			setTimeout( function () { _attributes.onKeyUp (_attributes.tag); }, 1);
		}	
		
		eventOnChange ();
							
		return result;
	}	
		
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
					setTimeout( function () { _attributes.onFocus (_attributes.tag); }, 1);
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
					setTimeout( function () { _attributes.onBlur (_attributes.tag); }, 1);
				}			
			}
		}
	}	
		
	// ------------------------------------
	// onChange
	// ------------------------------------			
	function eventOnChange ()
	{
		_attributes.value = _elements["input"].value;
	
		if (_attributes.onChange != null)
		{
			setTimeout( function () { _attributes.onChange (_attributes.tag); }, 1);
		}
	}				
}