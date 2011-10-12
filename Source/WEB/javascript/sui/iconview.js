// -------------------------------------------------------------------------------------------------------------------------
// iconview ([attributes])
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
iconview : function (attributes)
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
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;
	
	// Construct
	construct ();
								
	// Initialize
	SNDK.SUI.addInit (this);	
	
	// Functions
//	this.addItem = functionAddItem;
//	this.removeItem = functionRemoveItem;
//	this.moveItemUp = functionMoveItemUp;
//	this.moveItemDown = functionMoveItemDown;
//	this.moveItemTo = functionMoveItemTo;
					
	// Set/Get		
//	this.id = getsetId;
//	this.tag = getsetTag;
					
//	this.stylesheet = getsetStylesheet;
//	this.widthType = getsetWidthType;	
//	this.width = getsetWidth;
//	this.heightType = getsetHeightType;		
//	this.height = getsetHeight;

//	this.focus = getsetFocus;
//	this.disabled = getsetDisabled;		
//	this.readOnly = getsetReadOnly;
	
//	this.items = getsetItems;
//	this.selectedIndex = getsetSelectedIndex;
//	this.selectedItem = getsetSelectedItem;
//	this.count = getsetCount;
//	this.clear = getsetClear;

//	this.onFocus = getsetOnFocus;
//	this.onBlur = getsetOnBlur;
//	this.onChange = getsetOnChange;
			
	// Initialize
	
		
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
					// Disabled
		if (_attributes.disabled == null)
			_attributes.disabled = _defaults.disabled;					
		// Content
		_elements["content"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
		_elements["content"].style.clear = "both";			
			
		// ContentLeft
		_elements["contentleft"] = SNDK.tools.newElement ("div", "ContentLeft", null, _elements["content"]);
					
		// ContentCenter
		_elements["contentcenter"] = SNDK.tools.newElement ("div", "ContentCenter", null, _elements["content"]);		
		_elements["contentcenter"].style.overflow = "auto";
																										
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
				_elements["contentcenter"].setAttribute("tabIndex", 0);
				
				if (_attributes.focus)
				{
					_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
					setFocus ();
				}
				else
				{
					_elements["container"].className = _attributes.stylesheet;
				}						
			}	
		}		

		setDimensions ();
		
		if (_temp.initialized)
		{
			drawItems ();
		}
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
	// drawItems
	// ------------------------------------							
	function drawItems ()
	{
		if (_temp.initialized)
		{
			_elements["contentcenter"].innerHTML = " ";
			_elements["items"] = new Array ();

			for (index in _attributes.items)
			{
				_elements["items"][index] = new SNDK.tools.newElement ("div", {className: "Item", id: _attributes.id +"_"+ index, appendTo: _elements["contentcenter"]});
				SNDK.tools.newElement ("img", {src: _attributes.items[index]["imageURL"], className: "Image", appendTo: _elements["items"][index]});
				
				if (!_attributes.readOnly)
				{
					_elements["items"][index].onclick = eventOnItemClick;
				}				
			}
						
		}
	}
				
	// ------------------------------------
	// setattributes
	// ------------------------------------		
	function setAttributes ()
	{				
		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "SUIIconview";			
				
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
				
		// Disabled
		if (!_attributes.disabled)
			_attributes.disabled = false;
			
		// ReadOnly
		if (!_attributes.readOnly)
			_attributes.readOnly = false;	
			
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
		
		// Items
//		if (!_attributes.items) 
//		{
//			_attributes.items = new Array ();
//		}
//		else
//		{
//			_attributes.items = derefArray (_attributes.items);
//		}			
	}	
	
	function derefArray (array)
	{
		var temp = new Array ();
		for (index in array)
		{
			var index2 = temp.length;
			temp[index2] = new Array ();
			for (index3 in array[index])
			{
				temp[index2][index3] = array[index][index3];
			}			
		}

		return temp;		
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
	
	function setDimensions2 ()
	{		
		// Set width		
		var topleftwidth = SNDK.tools.getStyle (_elements["topleft"], "width");
		var topleftmarginleft = SNDK.tools.getStyle (_elements["topleft"], "margin-left");
		var toprightwidth = SNDK.tools.getStyle (_elements["topright"], "width");		
		var toprightmarginright = SNDK.tools.getStyle (_elements["topright"], "margin-right");			

		var headermarginleft = 0;
		var headermarginright = 0;			
		for (index in _attributes.columns)
		{
			if (_attributes.columns[index][2])
			{
				headermarginleft = SNDK.tools.getStyle (_elements["columnheaders"][index], "margin-left");
		 		headermarginright = SNDK.tools.getStyle (_elements["columnheaders"][index], "margin-right"); 
			}
		}
							
		var containerwidth = (parseInt (topleftwidth)) + (parseInt (topleftmarginleft)) + (parseInt (toprightwidth)) + (parseInt (toprightmarginright)); 
			
		if (_attributes.widthType == "percent")
		{
			_elements["container"].style.width = "100%";
			_elements["container"].style.height = "100%";				

			var pagesize = SNDK.tools.getPageSize ();
			if (_temp.pageSizeX == null || _temp.pageSizeY == null)
			{
				_temp.pageSizeX = pagesize[0];
				_temp.pageSizeY = pagesize[1];
			}


				
			setTimeout (	function () 
					{	

					if (_temp.pageSizeX != pagesize[0] || _temp.pageSizeY != pagesize[1])
					{
						_elements["topcenter"].style.width = 0 +"px";
						_elements["contentcenter"].style.width = 0 +"px";
						_elements["bottomcenter"].style.width = 0 +"px";
				
						_temp.pageSizeX = pagesize[0];
						_temp.pageSizeY = pagesize[1];				
					}	
					
								
						var h = _elements["container"].offsetHeight
						var w = _elements["container"].offsetWidth
						w = w - containerwidth;

						_elements["topcenter"].style.width = w +"px";
						_elements["contentcenter"].style.width = w +"px";
						_elements["bottomcenter"].style.width = w +"px";			

						_elements["contentleft"].style.height = _attributes.height +"px";
						_elements["contentcenter"].style.height = _attributes.height +"px";
						_elements["contentright"].style.height = _attributes.height +"px";	
						
										
					}, 0);						
		}
		else
		{
			_elements["topcenter"].style.width = _attributes.width - containerwidth +"px";
			_elements["contentcenter"].style.width = _attributes.width - containerwidth +"px";
			_elements["bottomcenter"].style.width = _attributes.width - containerwidth +"px";			
			_elements["container"].style.width = _attributes.width +"px";
		
//			var headertotalwidth = 0;
//			for (index in _attributes.columns)
//			{
//				if (_attributes.columns[index][2])
//				if (_attributes.columns[index].visible)
//				{
//					var columnwidth = parseInt (_attributes.columns[index].width);
//				
//					headertotalwidth = headertotalwidth + columnwidth + (parseInt (headermarginleft)) + (parseInt (headermarginright));
//				}
//			}
					
			_elements["contentleft"].style.height = _attributes.height +"px";
			_elements["contentcenter"].style.height = _attributes.height +"px";
			_elements["contentright"].style.height = _attributes.height +"px";						
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
	// setSelectedItem
	// ------------------------------------		
	function setSelectedItem (index)
	{
		if (_attributes.selectedIndex != -1)
		{
			_elements["items"][_attributes.selectedIndex].className = "Item";
		}

		_attributes.selectedIndex = parseInt (index);

		if (index != -1)
		{
			_elements["items"][index].className = "Item ItemSelected";
		}

		eventOnChange ();
	}	
	
	// ------------------------------------
	// removeItem
	// ------------------------------------					
	function removeItem (index)
	{
		_attributes.items.splice (index, 1);
		_attributes.selectedIndex = -1;

		refreshItems ();		
		
		if (index < _attributes.items.length)
		{
			setSelectedItem (index);
		}
		else
		{
			if (index > 0)
			{
				setSelectedItem (index - 1);
			}
			else
			{
				setSelectedItem (-1);
			}
		}
		
		eventOnChange ();
	}	
	
	// ------------------------------------
	// moveItem
	// ------------------------------------						
	function moveItem (index1, index2)
	{
		var temp1 = _attributes.items[index1];
		var temp2 = _attributes.items[index2];
		
		_attributes.items[index1] = temp2;
		_attributes.items[index2] = temp1;

		refreshItems ();
		setSelectedItem (index2);
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
	// addItem
	// ------------------------------------						
	function functionAddItem (item)
	{
		_attributes.items[_attributes.items.length] = item;
		refreshItems ();
		eventOnChange ();				
	}	
		
	// ------------------------------------
	// removeItem
	// ------------------------------------						
	function functionRemoveItem (index)
	{
		if (index != null)
		{
			removeItem (index);				
		}
		else if (_attributes.selectedIndex >= 0)
		{				
			removeItem (_attributes.selectedIndex);
		}
	}	

	// ------------------------------------
	// moveItem
	// ------------------------------------						
	function functionMoveItemTo (index1, index2)
	{		
	}
	
	// ------------------------------------
	// moveItemUp
	// ------------------------------------						
	function functionMoveItemUp (index)
	{
		if (index == null)
		{
			index = attributes.selectedIndex
		}
	
		if (index > 0)
		{
			moveItem (index, index-1);
		}		
	}
	
	// ------------------------------------
	// moveItemDown
	// ------------------------------------						
	function functionMoveItemDown (index)
	{
		if (index == null)
		{
			index = attributes.selectedIndex
		}

		if (index < (_attributes.items.length -1))
		{
			moveItem (index, index+1);
		}	
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
	// onChange
	// ------------------------------------							
	function eventOnChange ()
	{
		if (!_attributes.disabled)
		{		
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}			
		}
	}

	// ------------------------------------
	// onItemClick
	// ------------------------------------							
	function eventOnItemClick ()
	{
		if (!_attributes.disabled)
		{
			var index = this.id.split("_")[1];
				
			setSelectedItem (index)
							
			if (_attributes.onClick != null)
			{
				setTimeout( function ()	{ _attributes.onClick (); }, 1);
			}							
		}
	}

	// ------------------------------------
	// GETSET
	// ------------------------------------
	// ------------------------------------
	// id
	// ------------------------------------					
	function getsetId (value)
	{
		return _id;
	}

	// ------------------------------------
	// tag
	// ------------------------------------					
	function getsetTag (value)
	{
		if (value != null)
		{
			_attributes.tag = value
		}
		else
		{
			return _attributes.tag;
		}
	}
							
	// ------------------------------------
	// stylesheeet
	// ------------------------------------					
	function getsetStylesheet (value)
	{
		if (value != null)
		{
			_attributes.stylesheet = value
			refresh ();
		}
		else
		{
			return _attributes.stylesheet;
		}
	}
				
	// ------------------------------------
	// widthType
	// ------------------------------------
	function getsetWidthType (value)
	{
		if (value != null)
		{
			if (value == "percent" || value == "%")
			{
				_attributes.widthType = "percent";
			}
			else if (value == "pixel" || value == "px")
			{
				_attributes.widthType = "pixel";
			}

			setattributes ();
			refresh ();
		}
		else
		{
			return _attributes.width;
		}
	}		
		
	// ------------------------------------
	// width
	// ------------------------------------			
	function getsetWidth (value)
	{
		if (value != null)
		{
			_attributes.width = value;
			setattributes ();
			refresh ();
		}
		else			
		{
			return _attributes.widthType;
		}
	}
			
	// ------------------------------------
	// heightType
	// ------------------------------------
	function getsetHeightType (value)
	{
		if (value != null)
		{
			if (value == "percent" || value == "%")
			{
				_attributes.heightType = "percent";
			}
			else if (value == "pixel" || value == "px")
			{
				_attributes.heightType = "pixel";
			}

			setattributes ();
			refresh ();
		}
		else
		{
			return _attributes.heightType;
		}
	}		
		
	// ------------------------------------
	// height
	// ------------------------------------			
	function getsetHeight (value)
	{
		if (value != null)
		{
			_attributes.height = value;
			setattributes ();
			refresh ();
		}
		else			
		{
			return _attributes.height;
		}
	}			
	
	// ------------------------------------
	// focus
	// ------------------------------------			
	function getsetFocus (value)
	{
		if (value != null)
		{
			_attributes.focus = value;
			refresh ();
		}
		else
		{
			return _attributes.focus;
		}	
	}																
		
	// ------------------------------------
	// disabled
	// ------------------------------------			
	function getsetDisabled (value)
	{
		if (value != null)
		{
			_attributes.disabled = value;
			refresh ();
		}
		else
		{
			return _attributes.disabled;
		}	
	}	
	
	// ------------------------------------
	// readOnly
	// ------------------------------------			
	function getsetReadOnly (value)
	{
		if (value != null)
		{
			_attributes.readOnly = value;
			refreshItems ();
		}
		else
		{
			return _attributes.readOnly;
		}	
	}		
			
	// ------------------------------------
	// items
	// ------------------------------------			
	function getsetItems (value)
	{
		if (value != null)
		{
			_attributes.items = value;
			refreshItems ();
		}
		else
		{
			return _attributes.items;
		}
	}	
	
	// ------------------------------------
	// selectedIndex
	// ------------------------------------			
	function getsetSelectedIndex (value)
	{
		if (value != null)
		{
			setSelectedItem (value);
		}
		else
		{
			return _attributes.selectedIndex;
		}
	}											
				
	// ------------------------------------
	// selectedItem
	// ------------------------------------			
	function getsetSelectedItem (value)
	{
		if (value != null)
		{
			_attributes.items [_attributes.selectedIndex] = value;
			refreshItems ();
		}
		else
		{
			return _attributes.items [_attributes.selectedIndex];
		}
	}	
	
	// ------------------------------------
	// count
	// ------------------------------------			
	function getsetCount ()
	{	
		return _attributes.items.length;
	}	
	
	// ------------------------------------
	// clear
	// ------------------------------------			
	function getsetClear ()
	{			
		_attributes.items = new Array ();
		_attributes.selectedIndex = -1;
		refreshItems ();
		eventOnChange ();
	}																						
		
	// ------------------------------------
	// onFocus
	// ------------------------------------			
	function getsetOnFocus (value)
	{
		_attributes.onFocus = value;
	}														

	// ------------------------------------
	// onBlur
	// ------------------------------------			
	function getsetOnBlur (value)
	{
		_attributes.onBlur = value;
	}				
		
	// ------------------------------------
	// onChange
	// ------------------------------------			
	function getsetOnChange (value)
	{	
		if (value != null)
		{
			_attributes.onChange = value;
		}
		else
		{
			return _attributes.onChange;
		}
	}																								
}