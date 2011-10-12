// -------------------------------------------------------------------------------------------------------------------------
// Listview ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
//	addItem (item)
//	removeItem ([row])
//
//	setItem (item, [row])
//	getItem ([row])
//	setItems (items)
//	getItems ()
//
//	refresh ()
//	getAttributes (value)
//	setAttributes (key, value)
//
//		id		get
//		tag		get/set
//		stylesheet	get/set
//		width		get/set
//		height		get/set
//		managed		get/set
//		appendTo	get/set
//		disabled	get/set
//		onFocus		get/set
//		onBlur		get/set
//		onChange	get/set
//		columns		get/set
//		items		get/set
//		selectedRow	get/set
//		treeview	get/set		
//
//
// .addItem (array)
// .removeItem (int)
// .removeAllItems ();
// .moveItemUp ()
// .moveItemDowm ()
//
// .getItem ()
// .setItem (array)
// .getItems ()
// .setItems (array(array))
//
// .setAttribute (string, value)
// .getAttribute (string)
//
// -------------------------------------------------------------------------------------------------------------------------
// column = {title, tag, width, visible}
// -------------------------------------------------------------------------------------------------------------------------
//
// CHANGELOG:
// v1.04:
//	- Fixed Width/Height calculations. Dimensions should be set correct now, when using percentages.
//
// v1.03: 
//	- setItems fixed, array will be dereffed correctly.
//
// v1.02:
//	- Added support for treeview mode. 
//	- Changed row onClick to row onMouseDown. Makes the control feel more responsive.
//
// v1.01:
//	- Added get/set attribute. Cleaner way to access internal values. Depricated get/set will be remove on a later date. 
//
// v1.00:
//	- Initial release.

/**
 * @constructor
 */
listview : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;				
	var _temp = 	{ initialized: false,
			  id: SNDK.tools.newGuid (),
			  selectedRow: -1,			  
			  isDirty: true,
			  cache: new Array (),
			  bla: false
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
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;

	this.addItem = functionAddItem;
	this.removeItem = functionRemoveItem;	

	this.setItem = functionSetItem;
	this.getItem = functionGetItem;	
	this.setItems = functionSetItems;
	this.getItems = functionGetItems;


//	this.removeAllItems = functionRemoveAllItems;
//	this.moveItemUp = functionMoveItemUp;
//	this.moveItemDown = functionMoveItemDown;
//	this.canItemMove = functionCanItemMove;

				
					
	// GetSet		
//	this.id = getsetId;
//	this.tag = getsetTag;
					
//	this.width = getsetWidth;
//	this.height = getsetHeight;

//	this.focus = getsetFocus;
//	this.disabled = getsetDisabled;		

//	this.onFocus = getsetOnFocus;
//	this.onBlur = getsetOnBlur;
//	this.onChange = getsetOnChange;
	
//	this.selectedIndex = getsetSelectedIndex;
//	this.selectedItem = getsetSelectedItem;
//	this.count = getsetCount;
			
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
						
		// TopRight
		_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});
						
		// Headers
		_elements["header"] = SNDK.tools.newElement ("div", {appendTo: _elements["topcenter"]});
		_elements["header"].style.overflow = "hidden";
					
		// ColumnHeaders	
		_elements["columnheaders"] = new Array ();			
		for (index in _attributes.columns)
		{
			if (_attributes.columns[index].visible)
			{
				_elements["columnheaders"][index] = SNDK.tools.newElement ("div", {className: "Header", appendTo: _elements["header"]});
				_elements["columnheaders"][index].innerHTML = _attributes.columns[index].label;
				_elements["columnheaders"][index].style.overflow = "hidden";
				_elements["columnheaders"][index].style.whiteSpace = "nowrap";
//				_elements["columnheaders"][index].style.width = _attributes.columns[index].width;
			}
		}

		// Content
		_elements["content"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["content"].style.clear = "both";			
			
		// ContentLeft
		_elements["contentleft"] = SNDK.tools.newElement ("div", {className: "ContentLeft", appendTo: _elements["content"]});
					
		// ContentCenter
		_elements["contentcenter"] = SNDK.tools.newElement ("div", {className: "ContentCenter", appendTo: _elements["content"]});		
		_elements["contentcenter"].style.overflow = "auto";
																										
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
		// Only refresh if control has been initalized.	
		if (_temp.initialized)
		{
			// If disabled, change to disabled stylesheet.
			if (_attributes.disabled)
			{
				_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
				_elements["contentcenter"].removeAttribute("tabIndex");
			} 
			else
			{			
				// Set tabindex, it might have been removed if the control was disabled.
				_elements["contentcenter"].setAttribute("tabIndex", 0);
				
				// See if control is in focus or blur, change stylesheet accoridingly.
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
				// Remove all current rows.
				_elements["contentcenter"].innerHTML = " ";				
				_elements["rows"] = new Array ();
				
				// Redraw all rows.
				drawRows ({treeviewMatchValue: null});		
				
				// Redraw selected row.
				setSelectedRow (_temp.selectedRow);
				
				_temp.isDirty = false;	
			
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
	// setAttributes
	// ------------------------------------					
	function setAttributes ()
	{
		// Stylesheet
		if (!_attributes.stylesheet) 
		_attributes.stylesheet = "SUIListview";	
		
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

		// Items
		if (!_attributes.items) 
		{
			_attributes.items = new Array ();
		}
		else
		{
			_attributes.items = derefArray (_attributes.items);
		}
		
		// treeview
		if (!_attributes.treeview) 
			_attributes.treeview = false;		
		
		// treeviewLinkColumns
		if (_attributes.treeviewLinkColumns)
		{				
			_temp.treeviewParentColumn = _attributes.treeviewLinkColumns.split (":")[0]; 
			_temp.treeviewChildColumn = _attributes.treeviewLinkColumns.split (":")[1];
			
			if (!isNaN (_temp.treeviewParentColumn))
			{
				_temp.treeviewParentColumn = _attributes.columns[parseInt (_temp.treeviewParentColumn)].tag;
			} 
			
			if (!isNaN (_temp.treeviewChildColumn))
			{
				_temp.treeviewChildColumn = _attributes.columns[parseInt (_temp.treeviewChildColumn)].tag;
			} 						
		}	
		else if (_attributes.treeview)
		{
			throw "When control is in treeview mode, treeviewLinkColumns needs to be specified.";
		}

		// selectedRow
		if (!_attributes.selectedRow) 
			_attributes.selectedRow -1;
			
		// onFocus
		if (!_attributes.onFocus)
			_attributes.onFocus = null;	
			
		// onBlur
		if (!_attributes.onBlur)
			_attributes.onBlur = null;	
			
		// onChange
		if (!_attributes.onChange)
			_attributes.onChange = null;
			
		// columns
		if (!_attributes.columns)
			_attributes.columns = new Array ();
			
		for (index in _attributes.columns)
		{
			if (!_attributes.columns[index].width) 
				_attributes.columns[index].width = "*";	

			if (_attributes.columns[index].width != "*")
			{							
				if (_attributes.columns[index].width.substring (_attributes.columns[index].width.length - 1) == "%")
				{
					_attributes.columns[index].widthType = "percent";
					_attributes.columns[index].width = parseInt (_attributes.columns[index].width.substring (0, _attributes.columns[index].width.length - 1));	
				}
				else
				{
					_attributes.columns[index].widthType = "pixel";
					_attributes.columns[index].width = parseInt (_attributes.columns[index].width.substring (0, _attributes.columns[index].width.length - 2));
				}									
			}
			else
			{
				_attributes.columns[index].widthType = "dynamic";
			}
		}						
	}		

	function derefArray (array)
	{
		var temp = new Array ();
		for (index in array)
		{
			var index2 = temp.length;
			temp[index2] = new Array ();
			
//			for (bla1 in _attributes.columns)
	//		{
		//		console.log (_attributes.columns[bla1].tag);
			
//			}
	
			
			
			for (index3 in array[index])
			{
				temp[index2][index3] = array[index][index3];
				
				if (typeof(temp[index2][index3]) == "object")
				{
					temp[index2][index3] = "BLA"
				
				}
				
				//console.log (typeof(temp[index2][index3]))
				
			}			
		}

		//_attributes.items = temp;	
		
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


			var totalheightofrows = 0;


			for (index in _attributes.items)
			{
				totalheightofrows += 25;
			}
			
			if (totalheightofrows > height.contentCenter)
			{
				width.topCenter = width.topCenter - window.scrollbarWidth;
			}				

			var totalwidth = 0;														
			var dynamics = new Array ();
				
			for (index in _attributes.columns)
			{
				if (_attributes.columns[index].visible)
				{
					var bla = 0;
					var column = _attributes.columns[index];
								
					switch (column.widthType)
					{
						case "percent":
						{					
							_attributes.columns[index].calculatedWidth = Math.floor ((width.topCenter * column.width) / 100);
							_elements["columnheaders"][index].style.width = _attributes.columns[index].calculatedWidth - 10 +"px";						
							totalwidth += _attributes.columns[index].calculatedWidth;	
							
							break;
						}
					
						case "pixel":
						{
							_attributes.columns[index].calculatedWidth = column.width;
							_elements["columnheaders"][index].style.width = _attributes.columns[index].calculatedWidth - 10 +"px";						
							totalwidth += _attributes.columns[index].calculatedWidth;	
							
							break;
						}				
					
						case "dynamic":
						{
							dynamics[dynamics.length] = index;
	
							break;
						}											
					}
					
					for (index in dynamics)
					{
						_attributes.columns[dynamics[index]].calculatedWidth = Math.floor ((width.topCenter - totalwidth) / (dynamics.length));
						_elements["columnheaders"][dynamics[index]].style.width = _attributes.columns[dynamics[index]].calculatedWidth - 10 +"px";
					}							
				}
			}						
		}
	}	
	
	// ------------------------------------
	// drawRows
	// ------------------------------------			
	function drawRows (options)
	{
		if (!_attributes.treeview)
		{
			// Draw rows for normal view.
			for (index in _attributes.items)
			{
				drawRow ({itemIndex: index, indentDepth: indentdepth});
			}					
		}
		else
		{
			// Draw rows for treeview.
		
			var indentdepth = -1;
			
			if (options)
			{
				if (options.indentDepth != null)
				{
					indentdepth = options.indentDepth;
				}
			}
			
			indentdepth++;

			for (index in _attributes.items)
			{		
				// TODO: Needs to be cleaned.
				var test =_attributes.items[index][_temp.treeviewChildColumn];
				if (test == "")
				{
					test = null;
				}
				if (test == options.treeviewMatchValue)
				{
					drawRow ({itemIndex: index, indentDepth: indentdepth});
					
					drawRows ({treeviewMatchValue: _attributes.items[index][_temp.treeviewParentColumn], indentDepth: indentdepth});
				}
			}
		}	
	}	
	
	// ------------------------------------
	// drawRow
	// ------------------------------------	
	function drawRow (options)
	{
		var row = _elements["rows"].length;
	
		_elements["rows"][row] = new Array ();
		_elements["rows"][row][0] = SNDK.tools.newElement ("div", {className: "ItemRow", id: _attributes.id +"_"+ row, appendTo: _elements["contentcenter"]});
		_elements["rows"][row]["itemIndex"] = options.itemIndex;
		_elements["rows"][row]["indentDepth"] = options.indentDepth;
		_elements["rows"][row][0].style.overflow = "hidden";
		_elements["rows"][row][0].style.width = "100%";
		_elements["rows"][row][0].onmousedown = eventOnRowClick;

		SNDK.tools.textSelectionDisable (_elements["rows"][row][0]);

		for (column in _attributes.columns)
		{				
			if (_attributes.columns[column].visible)
			{
				_elements["rows"][row][column + 1] = SNDK.tools.newElement ("div", {className: "ItemColumn", id: _attributes.id +"_"+ row +"_"+ column, appendTo: _elements["rows"][row][0]});
				
				var content = "";

				if (_attributes.treeview)
				{
					if (column == 1)
					{
						content += "<span style='padding-left: "+ (options.indentDepth * 20) +"px;'> </span>";
					}
				}
				
				if (_attributes.columns[column].tag != null)
				{
					content += _attributes.items[options.itemIndex][_attributes.columns[column].tag];
				}
				else
				{
					content += _attributes.items[options.itemIndex][column];					
				}
								
				_elements["rows"][row][column + 1].innerHTML = content;			
				_elements["rows"][row][column + 1].style.width = _attributes.columns[column].calculatedWidth - 10 +"px";
				_elements["rows"][row][column + 1].style.overflow = "hidden";
				_elements["rows"][row][column + 1].style.whiteSpace = "nowrap";
			}
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
	// setSelectedRow
	// ------------------------------------		
	function setSelectedRow (row)
	{		
		if (_temp.selectedRow != -1)
		{
			_elements["rows"][_temp.selectedRow][0].className = "ItemRow";
		}
	
		_temp.selectedRow = parseInt (row);

		if (_temp.selectedRow != -1)
		{
			_elements["rows"][_temp.selectedRow][0].className = "ItemRow ItemRowSelected";			
		}

		//eventOnChange ();
	}	
	
	// ------------------------------------
	// removeRow
	// ------------------------------------					
	function removeRow (row)
	{			
		var currentindentdepth = _elements["rows"][row].indentDepth;
				
		_attributes.items.splice (_elements["rows"][row].itemIndex, 1);
		_temp.selectedRow = -1;
		_temp.isDirty = true;

		refresh ();		

		if (!_attributes.treeview)
		{
			if (row < _elements.rows.length)
			{
				setSelectedRow (row );
			}				
			else
			{
				setSelectedRow (row - 1);
			}
		}
		else
		{
			// If there is a row belove with same depth move cursor down.
			if (row < _elements.rows.length && _elements.rows[row].indentDepth == currentindentdepth)
			{
				setSelectedRow (row);
			}
			else
			{
				// Since there where no row below with same depth, search for row above with same depth.
				// If no row is found above, cursor will be deselected.
				for (index = row -1 ; index >= 0; index--)
				{
					if (_elements.rows[index].indentDepth == currentindentdepth)
					{
						setSelectedRow (index);
						break;				
					}
					else if (_elements.rows[index].indentDepth < currentindentdepth)
					{
						break;
					}					
				}
			}
		}
		
		eventOnChange ();
	}	
	
	// ------------------------------------
	// moveItem
	// ------------------------------------						
	function moveItem (row1, row2)
	{
		var index1 = _elements.rows[row1].itemIndex;
		var index2 = _elements.rows[row2].itemIndex;
	
		var temp1 = _attributes.items[index1];
		var temp2 = _attributes.items[index2];
		
		_attributes.items[index1] = temp2;
		_attributes.items[index2] = temp1;

		_temp.isDirty = true;
		refresh ();
		eventOnChange ();
	}


	// ------------------------------------
	// getNumberOfRowChildren (row)
	// ------------------------------------		
	function getNumberOfRowChildren (row)
	{
		var result = 0;
	
		if (_attributes.treeview)
		{
			for (index = row + 1; index < _elements.rows.length; index++)
			{
				if (_elements.rows[index].indentDepth == _elements.rows[row].indentDepth || _elements.rows[index].indentDepth < _elements.rows[row].indentDepth)
				{
					break;
				}
				
				result++;
			}
		}
		
		return result;	
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
		if (_temp.initialized)
		{
			var newitem = new Array ();
			for (index in item)
			{
				newitem[index] = item[index];
			}
			
			_attributes.items[_attributes.items.length] = newitem;
			_temp.isDirty = true;
			refresh ();
			eventOnChange ();		
		}
		else
		{

			var newitem = new Array ();
			for (index in item)
			{
				newitem[index] = item[index];
			}
			
			_attributes.items[_attributes.items.length] = newitem;
		}
	
	// TODO: fix this
//		var newitem = new Array ();	
//		for (index in item)
//		{
//			if (isNaN (index))
//			{
//				newitem[index] = item[index];					
//			}
//			else
//			{
//				if (_attributes.columns[index].tag != null)
//				{
//					newitem[_attributes.columns[index].tag] = item[index];
//				}
//				else
//				{
//					newitem[index] = item[index];
//				}		
//			}
//		}
		
	}	
		
	// ------------------------------------
	// removeItem
	// ------------------------------------						
	function functionRemoveItem (row)
	{
		if (row != null)
		{
			removeRow (row);				
		}
		else if (_temp.selectedRow >= 0)
		{				
			removeRow (_temp.selectedRow);
		}				
	}	
	
	// ------------------------------------
	// moveItemUp
	// ------------------------------------						
	function functionMoveItemUp (row)
	{
		if (row == null)
		{
			row = _temp.selectedRow;
		}

		if (!_attributes.treeview)
		{
			if (row > 0)
			{
				moveItem (row, row - 1);
				setSelectedRow (row - 1);
			}		
		}
		else
		{
			if (row > 0)
			{
		
				if (_elements.rows[row - 1].indentDepth == _elements.rows[row].indentDepth)
				{	
					moveItem (row, row - 1);
					setSelectedRow (row - 1);		
				}
				else
				{
					for (index = row - 1; index >= 0; index--)
					{
						if (_elements.rows[index].indentDepth == _elements.rows[row].indentDepth)
						{
							var row1 = row;
							var row2 = index;
							moveItem (row1, row2);
							setSelectedRow (row2);
							break;				
						}
						else if (_elements.rows[index].indentDepth < _elements.rows[row].indentDepth)
						{
							break;
						}					
					}				
				}								
			}
		}				
	}
	
	// ------------------------------------
	// moveItemDown
	// ------------------------------------								
	function functionMoveItemDown (row)
	{
		if (row == null)
		{
			row = _temp.selectedRow;
		}

		if (!_attributes.treeview)
		{
			if (row < _elements.rows.length - 1)
			{
				moveItem (row, row + 1);
				setSelectedRow (row + 1);
			}
		}
		else
		{
			if (row < _elements.rows.length)
			{
				if (_elements.rows[row + 1].indentDepth == _elements.rows[row].indentDepth)
				{	
					moveItem (row, row + 1);
					setSelectedRow (row + getNumberOfRowChildren (row + 1) + 1);
				}
				else
				{
					var row1 = row;
					var row2 = null;
					var row3 = null;															

					for (index = row + 1; index < _elements.rows.length; index++)
					{
						if (_elements.rows[index].indentDepth == _elements.rows[row].indentDepth)
						{	
							if (row2 == null)
							{
								row2 = index;
							}		
							else
							{
								row3 = index - row2;
								break;
							}
							
						}
						else if (_elements.rows[index].indentDepth < _elements.rows[row].indentDepth)
						{
							break;
						}					
					}				
					
					if (row3 == null)
					{
						row3 = row1 + 1;
					}
					
					if (row2 != null)
					{					
						moveItem (row1, row2);
						setSelectedRow (row3);				
					}
				}				
			}
		}
	}
	
	// ------------------------------------
	// removeAllItems
	// ------------------------------------						
	function functionRemoveAllItems ()
	{
		_attributes.items = new Array ();
		refreshItems ();
		eventOnChange ();
	}			

	// ------------------------------------
	// canItemMove
	// ------------------------------------						
	function functionCanItemMove (row)
	{
		var result = {up: false, down: false};
		
		if (!row)
		{
			row = _temp.selectedRow;
		}
		
		// Figure out if item can move UP
		if (!_attributes.treeview)
		{
			if (row > 0)
			{
				result.up = true;
			}		
		}
		else
		{
			if (row > 0)
			{
		
				if (_elements.rows[row - 1].indentDepth == _elements.rows[row].indentDepth)
				{	
					result.up = true;
				}
				else
				{
					for (index = row - 1; index >= 0; index--)
					{
						if (_elements.rows[index].indentDepth == _elements.rows[row].indentDepth)
						{
							result.up = true;
							break;				
						}
						else if (_elements.rows[index].indentDepth < _elements.rows[row].indentDepth)
						{
							break;
						}					
					}				
				}								
			}
		}		
		
		// Figure out if item can move DOWN
		if (!_attributes.treeview)
		{
			if (row < _elements.rows.length - 1)
			{
				result.down = true;
			}
		}
		else
		{
			if (row < _elements.rows.length)
			{
				if (_elements.rows[row + 1].indentDepth == _elements.rows[row].indentDepth)
				{	
					result.down = true;
				}
				else
				{				
					for (index = row + 1; index < _elements.rows.length; index++)
					{
						if (_elements.rows[index].indentDepth == _elements.rows[row].indentDepth)
						{	
							result.down = true;
						}
						else if (_elements.rows[index].indentDepth < _elements.rows[row].indentDepth)
						{
							break;
						}					
					}									
				}				
			}
		}		
				
		return result;
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
			
			case "disabled":
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
			
			case "selectedRow":
			{		
				return _temp.selectedRow;
			}					

			case "treeview":
			{		
				return _attributes.treeview;				
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
			
			case "disabled":
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
			
			case "selectedRow":
			{
				setSelectedRow (value);
				break;
			}		

			case "treeview":
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
	function eventOnRowClick ()
	{
		if (!_attributes.disabled)
		{		

			setSelectedRow (this.id.split("_")[1])
			
			eventOnChange ();
							
//			if (_attributes.onClick != null)
//			{
//				setTimeout( function ()	{ _attributes.onClick (); }, 1);
//			}							
		}
	}


	// ------------------------------------
	// getItem
	// ------------------------------------						
	function functionGetItem (row)
	{
		if (_temp.initialized)
		{
			if (row != null)
			{			
				return _attributes.items [_element.rows[row].itemIndex];
			}
			else
			{
				try
				{
									
					return _attributes.items [_elements.rows[_temp.selectedRow].itemIndex];
				}
				catch (error)
				{			
					return null
				}
			}	
		}
	}
	
	// ------------------------------------
	// setItem
	// ------------------------------------						
	function functionSetItem (item, row)
	{
		if (_temp.initialized)
		{
			if (row != null)
			{			
				_attributes.items [_element.rows[row].itemIndex] = item;
				_temp.isDirty = true;
				refresh ();								
			}
			else
			{		
				_attributes.items [_elements.rows[_temp.selectedRow].itemIndex] = item;
				_temp.isDirty = true;
				refresh ();
			}		
			
			eventOnChange ();
		}
	}

	// ------------------------------------
	// getItems
	// ------------------------------------						
	function functionGetItems ()
	{
		return _attributes.items;
	}

	// ------------------------------------
	// setItems
	// ------------------------------------						
	function functionSetItems (items)
	{
		if (items != null)
		{
			_attributes.items = derefArray (items);		
			
			if (_temp.initialized)
			{
//			_attributes.items = items;
				_temp.isDirty = true;
				refresh ();			
				eventOnChange ();
			}
		}
	}
}






