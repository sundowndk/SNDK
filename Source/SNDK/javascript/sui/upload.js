// -------------------------------------------------------------------------------------------------------------------------
// upload ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	id 		get
//	tag		get/set
//	name		get/set
//	stylesheet	get/set
//	managed		get/set
//	appendTo	get/set
//	width		get/set
//	height		get
//	disabled	get/set
//	onFocus		get/set
//	onBlur		get/set
//	onClick		get/set
//	label		get/set
//	value		get
//
// CHANGELOG:
//
// v1.03:
//	- Fixed dimension calculations, percentage should now be correct.
//	- Added managed mode.
//
// v1.02:
//	- Fixed width caluclation. Now works with percentage.
//	- Code cleanup.
//
// v1.01: 
//	- Changed the way legacy input is handled underneath. This makes for a more convicing button experience.
//
// v1.00:
//	- Initial release.
/**
 * @constructor
 */ 
upload : function (attributes)
{
	var _elements = new Array ();		
	var _attributes = attributes;	
				
	var _temp = 	{ initialized: false,
			  mouseDown: false,
			  mouseOver: false,
			  enterDown: false,
			  cache: new Array ()
			}
			
	_attributes.id = SNDK.tools.newGuid ();

	setAttributes ();		
						
	// Private functions
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;			
	this._init = init;
	
	// Public functions
	this.refresh = functionRefresh;
	this.dispose = functionDispose;
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;	
							
	// Construct
	construct ();	
	
	// Init Control
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
		_elements["container"].style.position = "relative";
									
		// TextLeft
		_elements["textleft"] = SNDK.tools.newElement ("div", {className: "TextLeft", appendTo: _elements["container"]});
		
		// TextCenter
		_elements["textcenter"] = SNDK.tools.newElement ("div", {className: "TextCenter", appendTo: _elements["container"]});
		SNDK.tools.textSelectionDisable (_elements["textcenter"]);

		// TextRight
		_elements["textright"] = SNDK.tools.newElement ("div", {className: "TextRight", appendTo: _elements["container"]});
					
		// ButtonLeft
		_elements["buttonleft"] = SNDK.tools.newElement ("div", {className: "ButtonLeft", appendTo: _elements["container"]});

		// ButtonCenter
		_elements["buttoncenter"] = SNDK.tools.newElement ("div", {className: "ButtonCenter", appendTo: _elements["container"]});
		SNDK.tools.textSelectionDisable (_elements["buttoncenter"]);

		// ButtonRight
		_elements["buttonright"] = SNDK.tools.newElement ("div", {className: "ButtonRight", appendTo: _elements["container"]});
				
		// LEGACY
		_elements["legacy"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});		
		_elements["legacy"].style.overflow = "hidden";
		_elements["legacy"].style.position = "absolute";		
		_elements["legacy"].style.height = "32px";
		_elements["legacy"].style.right = "0px";

		// Input
		_elements["input"] = SNDK.tools.newElement ("input", {name: attributes.name, type: "file", appendTo: _elements["legacy"]});
		_elements["input"].style.position = "absolute";		
		_elements["input"].style.fontSize = "23px";	
		//_elements["input"].accept =  "image/jpeg,image/gif";
		
		SNDK.tools.changeOpacityByObject (_elements["input"], 0);

		if ( client.browser == "Firefox" || client.browser == "Opera" ) 
		{
			_elements["input"].style.right = '0px';
		}
		else if ( client.ie ) 
		{			
			//_elements["input"].style.width = '0';
		}							
																	
		// Hook events	
		_elements["input"].onfocus = eventOnFocus;
		_elements["input"].onblur = eventOnBlur;
		_elements["input"].onchange = eventOnChange;			
		_elements["input"].onmousedown = eventOnMouseDown;
		_elements["input"].onmouseup = eventOnMouseUp;		
		_elements["input"].onmouseover = eventOnMouseOver;
		_elements["input"].onmouseout = eventOnMouseOut;

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
				_elements["legacy"].style.display = "none";
				_attributes.focus = false;
				eventOnBlur ();						
			}
			else
			{				
				if (_attributes.focus)
				{
					if (_temp.mouseDown)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus "+ _attributes.stylesheet +"LeftClicked";
					}
					else
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus";					
					}
					setFocus ();					
				}
				else
				{
					_elements["container"].className = _attributes.stylesheet;
				}
				
				_elements["legacy"].style.display = "block";
			}
								
			_elements["textcenter"].innerHTML = _attributes.value;	
			_elements["buttoncenter"].innerHTML = _attributes.label;
		}
		
		setDimensions ();
	}	
	
	function Dispose ()
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
			_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["textleft"]) + SNDK.tools.getElementStyledWidth (_elements["textright"]) + SNDK.tools.getElementStyledWidth (_elements["buttonleft"]) + SNDK.tools.getElementStyledWidth (_elements["buttoncenter"]) + SNDK.tools.getElementStyledWidth (_elements["buttonright"]);
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["textcenter"]);
		
			_temp.cache["buttonWidth"] = SNDK.tools.getElementStyledWidth (_elements["buttonleft"]) + SNDK.tools.getElementStyledWidth (_elements["buttoncenter"]) + SNDK.tools.getElementStyledWidth (_elements["buttonright"]);

		}
		
		_temp.cacheUpdated = true;	
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
			
			width.textCenter = width.container - _temp.cache.containerWidth;
			width.legacy = _temp.cache.buttonWidth;

			SNDK.tools.getElementStyledWidth (_elements["buttonleft"]) + SNDK.tools.getElementStyledWidth (_elements["buttoncenter"]) + SNDK.tools.getElementStyledWidth (_elements["buttonright"]) +"px";

			_elements["container"].style.width = width.container +"px";
			_elements["textcenter"].style.width = width.textCenter +"px";
			_elements["legacy"].style.width = width.legacy +"px";				
		}	
	}		
	
	// ------------------------------------
	// refresh
	// ------------------------------------				
	function functionRefresh ()
	{
		refresh ();
	}	
					
	// ------------------------------------
	// setAttributes
	// ------------------------------------		
	function setAttributes ()
	{
		// Managed
		if (!_attributes.managed)		
			_attributes.managed = false;				
	
		// Name
		if (!_attributes.name)		
			_attributes.name = "";		
	
		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "SUIUpload";			
					
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
						
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
			
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
		_attributes.value = "";						
	}	
	
	// ------------------------------------
	// setFocus
	// ------------------------------------				
	function setFocus ()
	{
		setTimeout ( function () { _elements["input"].focus ();	}, 1);	
	}			
		
	// ------------------------------------
	// Public functions
	// ------------------------------------				
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
			
			case "focus":
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

			case "label":
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
			
			case "focus":
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

			case "label":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}

			case "value":
			{
				throw "Attribute with name VALUE is ready only.";
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
				
	// ------------------------------------
	// onMouseDown
	// ------------------------------------						
	function eventOnMouseDown ()
	{
		if (!_attributes.disabled)
		{
			_temp.mouseDown = true;
			_attributes.focus = true;
			refresh ();
		}
	}
	
	// ------------------------------------
	// onMouseUp
	// ------------------------------------						
	function eventOnMouseUp ()
	{
		if (_attributes.disabled)
		{
			_temp.mouseDown = false;
			refresh ();
		}		
	}
		
	// ------------------------------------
	// onMouseOver
	// ------------------------------------	
	function eventOnMouseOver ()
	{
		if (!_attributes.disabled)
		{		
			_temp.mouseOver = true;
			refresh ();
		}
	}	
	
	// ------------------------------------
	// onMouseOut
	// ------------------------------------	
	function eventOnMouseOut ()
	{
		if (!_attributes.disabled)
		{
			if (_temp.mouseDown)
			{		
				_temp.mouseOver = false;
				_temp.mouseDown = false;				
				refresh ();
			}	
		}
	}	
				
	// ------------------------------------
	// onChange
	// ------------------------------------						
	function eventOnChange ()
	{	
		_attributes.value = _elements["input"].value;
		refresh ();
			
		if (_attributes.onChange != null)
		{
			setTimeout( function ()	{ _attributes.onChange (); }, 1);
		}
	}			
}