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
		_attributes.items = derefItems (_attributes.items);
	}
	
	// treeview
	if (!_attributes.treeview) 
		_attributes.treeview = false;		
		
	if (!_attributes.treeviewRootValue) 
		_attributes.treeviewRootValue = "";					
	
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

	// unique
	if (!_attributes.unique) 
	{
		_attributes.unique = false;
	}
	else
	{
		_attributes.uniqueColumn = _attributes.unique;
		_attributes.unique = true;			
	}
	
	// selectedRow
	if (!_attributes.selectedRow) 
		_attributes.selectedRow = -1;
		
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
		if (_temp.isDirty)
		{			
			var draw = 	function () 
						{
							// Remove all current rows.
							_elements["contentcenter"].innerHTML = " ";				
							_elements["rows"] = new Array ();
			
							// Redraw all rows.								
							_elements["contentcenter"].style.display ="none";
							drawRows ({treeviewMatchValue: null});		
							_elements["contentcenter"].style.display ="block";
							
							// Redraw selected row.
							setSelectedRow (_temp.selectedRow);
			
							_temp.isDirty = false;						 
						};
		
			setTimeout (draw, 0);				
		}			
	}
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
		_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
		_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
		_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
	}
	
	_temp.cacheUpdated = true;	
}		
	
// ------------------------------------
// drawRows
// ------------------------------------			
function drawRows (options)
{
	if (!_attributes.treeview)
	{
		// Draw rows for normal view.			
		var length = _attributes.items.length;
		for (var index = 0; index < length; index++)			
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

		var length = _attributes.items.length;
		for (var index = 0; index < length; index++)			
		//for (index in _attributes.items)			
		{					
			var test =_attributes.items[index][_temp.treeviewChildColumn];
			
			if (test == _attributes.treeviewRootValue)
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
function drawRow (attributes)
{
	var rowcount = _elements["rows"].length;
	var container = document.createDocumentFragment ()		
	var row = new Array ();
		
	row[0] = SNDK.tools.newElement ("div", {className: "ItemRow", id: _attributes.id +"_"+ rowcount, appendTo: container});
	row[0].style.overflow = "hidden";
	row[0].style.width = "100%";
	row[0].onmousedown = eventOnRowClick;
	row["itemIndex"] = attributes.itemIndex;
	row["indentDepth"] = attributes.indentDepth;

	SNDK.tools.textSelectionDisable (row[0]);

	for (columncount in _attributes.columns)
	{				
		if (_attributes.columns[columncount].visible)
		{	
			var content = "";			
			var column = SNDK.tools.newElement ("div", {className: "ItemColumn", id: _attributes.id +"_"+ rowcount +"_"+ columncount, appendTo: row[0]});				

			if (_attributes.treeview)
			{
				if (columncount == 1)
				{
					content += "<span style='padding-left: "+ (attributes.indentDepth * 20) +"px;'> </span>";
				}
			}
			
			if (_attributes.columns[columncount].tag != null)
			{
				content += _attributes.items[attributes.itemIndex][_attributes.columns[columncount].tag];
			}
			else
			{
				content += _attributes.items[attributes.itemIndex][columncount];					
			}
											
			column.innerHTML = content;							
			column.style.width = _attributes.columns[columncount].calculatedWidth - 10 +"px";
			column.style.overflow = "hidden";
			column.style.whiteSpace = "nowrap";
		}
	}
	
	_elements["rows"][rowcount] = row;		
	_elements["contentcenter"].appendChild (container);
}			

// ------------------------------------
// setFocus
// ------------------------------------				
function setFocus ()
{
	setTimeout ( function () { _attributes.focus = true;  _elements["contentcenter"].focus (); }, 20);	
}		
	
// ------------------------------------
// setSelectedRow (row)
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
}	
	
// ------------------------------------
// removeItem ([itemindex])
// ------------------------------------					
function removeItem (itemIndex)
{
	var row = _temp.selectedRow;

	if (itemIndex != null)
	{
		// Find row via itemindex.
		for (i in _elements["rows"])
		{				
			if (_elements["rows"][i].itemIndex == itemIndex)
			{					
				row = i;
				break;
			}			
		}	
		
		// If the itemindex was not found, then there is no need to continue.
		return;
	}		

	removeRow (row);		
}

// ------------------------------------
// removeAllItems
// ------------------------------------					
function removeAllItems ()
{
	_attributes.items = new Array ();
	refresh ();
	eventOnChange ();
}
																															
// ------------------------------------
// removeRow ([row])
// ------------------------------------					
function removeRow (row)
{						
	if (row != -1 && row >= _elements.rows.length)
	{
		// Remove item from item list.
		var currentindentdepth = _elements["rows"][row].indentDepth;
		_attributes.items.splice (_elements["rows"][row].itemIndex, 1);
		_temp.isDirty = true;
					
		// If row was the selected one, we need to deal with that.
		if (row == _temp.selectedRow)
		{							
			_temp.selectedRow = -1;
		
			var currentindentdepth = _elements["rows"][row].indentDepth;

			if (!_attributes.treeview)
			{										
				// Top row removed with rows below.
				if (row == 0 && _elements.rows.length > 1)
				{
					_temp.selectedRow = 0;
				}
				// Bottom row removed with no rows below.
				else if (row == (_elements.rows.length - 1))
				{
					_temp.selectedRow = (row - 1);
				}
				// Middle row removed with rows below.				
				else if (row < _elements.rows.length)
				{
					_temp.selectedRow = row;
				}
			}
			else
			{					
				
				if ((row < _elements.rows.length - 1) && _elements.rows[row+1].indentDepth == currentindentdepth)
				{
					_temp.selectedRow = row;
				}
				// Bottom row removed with no rows below.
				else if (row == (_elements.rows.length - 1))
				{						
					_temp.selectedRow = (row - 1);					
				}
				// Bottom row removed with rows below that are not at the same depth.
				else if ((row < _elements.rows.length -1) && (_elements.rows[row+1].indentDepth != currentindentdepth))
				{
					_temp.selectedRow = (row - 1);
				}					
			}			
		}			
	
		refresh ();		
		eventOnChange ();				
	}
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
// addItem (item)
// ------------------------------------				
function addItem (item)
{
	var result = 0;

	if (_attributes.unique)
	{					
		for (i in _attributes.items)
		{
			if (_attributes.items[i][_attributes.uniqueColumn] == item[_attributes.uniqueColumn])
			{					
				result = i;
				break;
			}
		}		
	}
	else
	{
		result = _attributes.items.length;
		_attributes.items[result] = derefItem (item);
	}			
	
	_temp.isDirty = true;
	
	return result
}	
	
// ------------------------------------
// derefItem
// ------------------------------------
function derefItem (item)
{
	var result = new Array ();
						
	for (key in item)
	{				
		var columnname = null;
		var condense;
		var value;
					
		for (index in _attributes.columns)			
		{
			var column = _attributes.columns[index];
//				if (c.condense != null)
//				{	
//					if (c.tag == key)
//					{
//						column = c.tag;
//						condense = c.condense;
//						break;
//					}
//				}
			if (column.tag == key)
			{									
				columnname = column.tag;
				break;
			}				
		}

		if (columnname == null)
		{			
			continue;
		}
					
//			if ((typeof(item[key]) == "object") && (column.visible == true))
//			{
//				value = "";
//				for (index2 in item[key])
//				{									
//					value += item[key][index2]["value"] +", ";
//				}				
//					
//				value = SNDK.string.trimEnd (value, ", ");							
//			}
//			else				
//			{
			value = item[key];				
//			}										
													
		result[columnname] = value;
	}
					
	return result;		
}	

// ------------------------------------
// derefItems
// ------------------------------------	
function derefItems (array)
{
	var result = new Array ();
	
	for (i in array)
	{			
		result[result.length] = derefItem (array[i]);
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
