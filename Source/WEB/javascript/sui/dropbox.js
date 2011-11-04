// -------------------------------------------------------------------------------------------------------------------------
// dropbox ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .addItem ({title, value})
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	id 		get
//	tag		get/set
//	stylesheet	get/set
//	managed		get/set
//	appendTo	get/set
//	width		get/set
//	height		set
//	disabled	get/set
//	onFocus		get/set
//	onBlur		get/set
//	onChange	get/set
//	selectedItem	get/set
//
//
// CHANGELOG:
//
// v1.02:
//	- Fixed so that itemlist is drawn not to the document but the actual parent element.
//	- Fixed dimension calculations, should be ok now.
//	- Added managed mode.
//
// v1.01: 
//	- Fixed width caluclation. Now works with percentage.
//	- Added a way to tell if default value is still selected.
//	- Itemlist is now rendered in the page document, and ontop of every other element.
//	- Code cleanup.
//
// v1.00:
//	- Initial release.
/**
 * @constructor
 */ 
dropbox : function (attributes)
{
	var _elements = new  Array ();
	var _attributes = attributes;
			
	var _temp = 	{ initialized: false,		
			  selectedItem: -1,	  
	 	 	  itemListVisible: false,
			  noPrevSelection: true,
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
	this.addItem = functionAddItem;	
	this.selectItemByTitle = functionSelectItemByTitle;
	this.selectItemByValue = functionSelectItemByValue;
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;	
	
	this.setSelectedItemByTitle = functionSelectItemByTitle;
	this.setSelectedItemByValue = functionSelectItemByValue;

	// Construct
	construct ();
	
	// Initialize
	SNDK.SUI.addInit (this);	

	// ------------------------------------
	// Private functions
	// ------------------------------------
	function init ()
	{
		updateCache ();

		_attributes.heightType = "pixel";
		_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";		
		
		_attributes.appendTo.appendChild (_elements["itemlistcontainer"])
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
		//_elements["container"].style.position = "relative";		
	
		// Control Left
		_elements["left"] = SNDK.tools.newElement ("div", "Left", null, _elements["container"]);

		// Control Center
		_elements["center"] = SNDK.tools.newElement ("div", "Center", null, _elements["container"]);

		// Control Right
		_elements["right"] = SNDK.tools.newElement ("div", "Right", null, _elements["container"]);

		// Control Input
		_elements["legacy"] = SNDK.tools.newElement ("input", {className: "Input", type: "hidden", appendTo: _elements["container"]});		
		_elements["legacy"].setAttribute ("name", _attributes.name);

		// Control Text
		_elements["text"] = SNDK.tools.newElement ("div", "Text", null, _elements["center"]);
		_elements["text"].style.overflow = "hidden";
		_elements["text"].style.whiteSpace = "nowrap";
		SNDK.tools.textSelectionDisable (_elements["text"]);

		// Itemlist Container
		_elements["itemlistcontainer"] = SNDK.tools.newElement ("div", {className: "SUIDropbox"});
		_elements["itemlistcontainer"].style.position = "absolute";
		_elements["itemlistcontainer"].style.display = "none";
		_elements["itemlistcontainer"].style.zIndex = 1000;
		_elements["itemlistcontainer"].style.border = "none";		

		// Control Itemlist
		_elements["itemlist"] = SNDK.tools.newElement ("div", {className: "SUIDropbox ItemList", appendTo: _elements["itemlistcontainer"]});
		//_elements["itemlist"].style.display = "none";

		// Control Arrow
		_elements["arrow"] = SNDK.tools.newElement ("div", "Arrow", null, _elements["center"]);

		// Hook Events
		_elements["container"].onfocus = eventOnFocus;
		_elements["container"].onblur = eventOnBlur;
		_elements["container"].onkeypress = eventOnKeyPress;
		_elements["container"].onclick = eventOnClick;
		
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
				_elements["container"].removeAttribute("tabIndex");
				_attributes.focus = false;
				eventOnBlur ();				
			}
			else
			{
				_elements["container"].setAttribute("tabIndex", 0);
			
				if (_attributes.focus)
				{
					_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus";
					setFocus ();
				}
				else
				{
					if (_temp.itemListVisible)
					{
						toggleItemList ();
					}
				
					_elements["container"].className = _attributes.stylesheet;
				}
			}

			_elements["items"] = new Array ();
			_elements["itemlist"].innerHTML = "";
			for (index in _attributes.items)
			{
				_elements["items"][index] = SNDK.tools.newElement ("div", "Item", _attributes.id +"_"+ index, _elements["itemlist"]);
				_elements["items"][index].innerHTML = _attributes.items[index].label;
				_elements["items"][index].onmouseover = eventOnMouseOverItem;
				_elements["items"][index].onmouseout = eventOnMouseOutItem;
				_elements["items"][index].onmousedown = eventOnClickItem;
			}					
			
			if (_attributes.selectedItem != -1)
			{
				_elements["text"].innerHTML = _attributes.items[_attributes.selectedItem].label;
				_elements["legacy"].value = _attributes.items[_attributes.selectedItem].value;
				_elements["items"][_attributes.selectedItem].className = "Item ItemSelected";
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
			_temp.cache["containerMargin"] = SNDK.tools.getElementStyledMargin (_elements["container"]);
			
			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["center"]);
			
			_temp.cache["itemlistPadding"] = SNDK.tools.getElementStyledPadding (_elements["itemlist"]);
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
			_attributes.stylesheet = "SUIDropbox"

		if (!_attributes.name)
			_attributes.name = ""

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
			_attributes.disabled = false
	
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
			
		// Items
		if (!_attributes.items)
		{
			_attributes.items = new Array ();
		}		
		// SelectedItem
		if (!_attributes.selectedItem)
			_attributes.selectedItem = -1;
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
			width.itemlist = width.container - _temp.cache.itemlistPadding["horizontal"];

			_elements["container"].style.width = width.container +"px";
			_elements["center"].style.width = width.center +"px";
			_elements["itemlist"].style.width = width.itemlist  +"px";
			
			var pos = SNDK.tools.getElementPosition (_elements["container"], true)

			_elements["itemlistcontainer"].style.left = pos[0] - _temp.cache.containerMargin.left + "px";
			_elements["itemlistcontainer"].style.top = pos[1] + _temp.cache["containerHeight"] - _temp.cache.containerMargin.top + "px";
		}
	}
			
	// ------------------------------------
	// setFocus
	// ------------------------------------
	function setFocus ()
	{
		setTimeout ( function () { _elements["container"].focus (); }, 2);					
	}		
	
	// ------------------------------------	
	// setItemListFocus 
	// ------------------------------------
	function setItemListFocus (index)
	{
		if (_temp.selectedItem != -1)
		{
			if (_temp.selectedItem != _attributes.selectedItem)
			{
				_elements["items"][_temp.selectedItem].className = "Item";
			}
			else
			{
				_elements["items"][_temp.selectedItem].className = "Item ItemSelected";
			}
		}
		
		if (index != -1 && index != null)
		{
			_elements["items"][index].className = "Item ItemFocus";
			_temp.selectedItem = parseInt (index);
		}						
	}		
		
		
	// ------------------------------------
	// setSelectedItem
	// ------------------------------------
	function setSelectedItem (index)
	{
		if (_temp.initialized)
		{
			if (_attributes.selectedItem != index)
			{
				if ((index >= 0) || (index < _attributes.items.length))
				{
					_elements["items"][index].className = "Item ItemSelected";
					if (_attributes.selectedItem != -1)
					{
						_elements["items"][_attributes.selectedItem].className = "Item";
					}
	
					_attributes.selectedItem = parseInt (index);
					
					refresh ();
						
					eventOnChange ();
				}
			}
		}
		else
		{		
			_attributes.selectedItem = index;
		}
	}	
	
	// ------------------------------------
	// toggleItemList
	// ------------------------------------
	function toggleItemList ()
	{
		if (_temp.itemListVisible == false)
		{

			SNDK.page.hasFocus = false;

			_elements["itemlistcontainer"].style.display = "block";
			_temp.itemListVisible = true;
			
			if (_attributes.selectedItem != -1)
			{
				_temp.selectedItem = _attributes.selectedItem;			
				_temp.noPrevSelection = false;
			}
			else
			{
				_temp.selectedItem = -1;
				_temp.noPrevSelection = true;
			}			
		}
		else
		{
			_elements["itemlistcontainer"].style.display = "none";
			_temp.itemListVisible = false;

			SNDK.page.hasFocus = true;
		}
	}

	// -------------------------------------
	// keyhandler
	// -------------------------------------
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

		if (key == 13)						// Enter
		{
			eventOnKeyPressEnter ();
		}
		else if (key == 27)					// ESC
		{
			eventOnKeyPressEsc ();
		}
		else if (key == 38)					// ArrowUp
		{
			eventOnKeyPressArrowUp ();
		}
		else if (key == 40)					// ArrowDown
		{
			eventOnKeyPressArrowDown ();
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
	// addItem
	// ------------------------------------
	function functionAddItem (item)
	{
		_attributes.items[_attributes.items.length] = item;
		refresh ()
	}
	
	// ------------------------------------
	// selectItemByTitle
	// ------------------------------------
	function functionSelectItemByTitle (title)
	{
		for (index in _attributes.items)
		{
			if (_attributes.items[index][1] == title)
			{
				setSelectedItem (index)
			}
		}
	}

	// ------------------------------------
	// selectItemByValue
	// ------------------------------------
	function functionSelectItemByValue (value)
	{
		for (index in _attributes.items)
		{
			if (_attributes.items[index][0] == value)
			{
				setSelectedItem (index);
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

			case "selectedItem":
			{
				return _attributes.items[_attributes.selectedItem];
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

			case "selectedItemByValue":
			{							
				for (index in _attributes.items)
				{				
					if (_attributes.items[index].value == value)
					{
						setSelectedItem (index);
						break;
					}
				}
				break;
			}			
					
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}				

	// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Events				
	// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------
	// onKeyPress
	// ------------------------------------
	function eventOnKeyPress (event)
	{
		keyHandler(event);
	}

	// ------------------------------------
	// onKeyPressEnter
	// ------------------------------------
	function eventOnKeyPressEnter ()
	{
		if (_temp.itemListVisible)
		{
			setSelectedItem (_temp.selectedItem);
		}
		
		toggleItemList ();
	}

	// ------------------------------------
	// onKeyUp
	// ------------------------------------
	function eventOnKeyPressArrowUp ()
	{
		if (_temp.itemListVisible)
		{
			var index = _attributes.items.length - 1;
		
			if (_temp.selectedItem > 0)
			{
				index = _temp.selectedItem - 1; 			
			}					

			setItemListFocus (index);
		}
		else
		{
			var index = _attributes.items.length - 1;
		
			if (_attributes.selectedItem > 0)
			{
				index = _attributes.selectedItem - 1; 			
			}					

			setSelectedItem (index);
		}
		
	}

	// ------------------------------------
	// onKeyDown
	// ------------------------------------
	function eventOnKeyPressArrowDown ()
	{
		if (_temp.itemListVisible)
		{
			var index = 0;

			if (_temp.selectedItem < _attributes.items.length-1)
			{
				index = (_temp.selectedItem + 1); 
			}
			
			setItemListFocus (index);
		}
		else
		{
			var index = 0;
			
			if (_attributes.selectedItem < _attributes.items.length-1)
			{
				index = _attributes.selectedItem + 1; 
			}
			
			setSelectedItem (index);		
		}	
	}

	// ------------------------------------
	// onKeyPressEsc
	// ------------------------------------
	function eventOnKeyPressEsc ()
	{
		if (_temp.itemListVisible)
		{			
			if (_temp.selectedItem != -1)		
			{
				_elements["items"][_temp.selectedItem].className = "Item";
			}
			
			if (_attributes.selectedItem != -1)
			{
				_elements["items"][_attributes.selectedItem].className = "Item ItemSelected";
			}
					
			toggleItemList ();
		}
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
					setTimeout( function ()	{ _attributes.onFocus (_name); }, 1);
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
					setTimeout( function ()	{ _attributes.onBlur (_name); }, 1);
				}
			}
		}
	}

	// ------------------------------------
	// onClick
	// ------------------------------------
	function eventOnClick ()
	{
		if (!_attributes.disabled)
		{
			toggleItemList ();
		}
	}

	// ------------------------------------
	// onClickItem
	// ------------------------------------
	function eventOnClickItem (event)
	{
		if (!_attributes.disabled)
		{	

			if (client.browser == "Explorer")
			{
				window.event.cancelBubble = true
			}
			else
			{
				event.stopPropagation ();
			}

			var split = this.id.split("_");
			var index = split[split.length-1];		
			
			setSelectedItem (index);
			toggleItemList ();
		}
	}

	// ------------------------------------
	// onChange
	// ------------------------------------
	function eventOnChange ()
	{
		if (_attributes.onChange != null)
		{
			setTimeout( function ()	{ _attributes.onChange (); }, 0);
		}
	}
			
	// ------------------------------------
	// onMouseOverItem
	// ------------------------------------
	function eventOnMouseOverItem ()
	{
		var split = this.id.split("_");
		var index = split[split.length-1];

		setItemListFocus (index);
	}

	// ------------------------------------
	// onMouseOutItem
	// ------------------------------------
	function eventOnMouseOutItem ()
	{
		var split = this.id.split("_");
		var index = split[split.length-1];
		
		setItemListFocus ();
	}
}