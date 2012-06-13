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
// addItem
// ------------------------------------						
function functionAddItem (item)
{					
	var result = addItem (item);
		
	if (_temp.initialized)
	{
		refresh ();
		eventOnChange ();		
	}
	
	return result;
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
			return _attributes.items [_elements.rows[row].itemIndex];
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
			
//				for (index in _elements.rows)
//				{
//					if (_element.rows[row].itemIndex == row)
//					{
			_attributes.items [row] = derefItem (item);
//					}				
//				}
				
//				_attributes.items [_element.rows[row].itemIndex] = derefItem (item);							
			
			_temp.isDirty = true;
			refresh ();								
		}
		else
		{		
			_attributes.items [_elements.rows[_temp.selectedRow].itemIndex] = derefItem(item);
			_temp.isDirty = true;
			refresh ();
		}		
		
		eventOnChange ();
	}
}	
	
// ------------------------------------
// removeItem
// ------------------------------------						
function functionRemoveItem (itemIndex)
{
	removeItem (itemIndex);	
}	
	
// ------------------------------------
// addItems
// ------------------------------------								
function functionAddItems (items)
{
	for (i in items)
	{
		addItem (items[i]);
	}

	if (_temp.initialized)
	{
		refresh ();
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
		_attributes.items = derefItems (items);		
		
		if (_temp.initialized)
		{
//			_attributes.items = items;
			_temp.isDirty = true;
			refresh ();			
			eventOnChange ();
		}
	}
}	

// ------------------------------------
// removeAllItems
// ------------------------------------						
function functionRemoveAllItems ()
{
	removeAllItems ();	
}	
	
// ------------------------------------
// removeRow
// ------------------------------------						
function functionRemoveRow (row)
{
	if (row != null)
	{	
		removeRow (row);
	}
	else		
	{
		removeRow (_temp.selectedRow);
	}
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

	// Figure out if item can move up.
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
				for (i = (row - 1); i >= 0; i--)
				{
					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
					{
						result.up = true;
						break;				
					}
					else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
					{
						break;
					}					
				}				
			}								
		}
	}
	
	// Figure out if item can move down.
	if (!_attributes.treeview)
	{
		if (row < _elements.rows.length - 1)
		{
			result.down = true;
		}
	}
	else
	{
		if (row < (_elements.rows.length - 1))
		{
			if (_elements.rows[row + 1].indentDepth == _elements.rows[row].indentDepth)
			{	
				result.down = true;
			}
			else
			{				
				for (i = (row + 1); i < _elements.rows.length; i++)
				{
					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
					{	
						result.down = true;
					}
					else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
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
// moveItemUp
// ------------------------------------						
function functionMoveItemUp (row)
{
	if (!row )
	{
		row = _temp.selectedRow;
	}

	var from;
	var to;

	if (!_attributes.treeview)
	{
		if (row > 0)
		{
			moveItem (row, (row - 1));
			setSelectedRow ((row - 1));
			
			from = row;
			to = (row -1);
		}		
	}
	else
	{
		if (row > 0)
		{	
			if (_elements.rows[(row - 1)].indentDepth == _elements.rows[row].indentDepth)
			{	
				moveItem (row, (row - 1));
				setSelectedRow ((row - 1));		
				
				from = row;
				to = (row - 1);

			}
			else
			{
				for (i = (row - 1); i >= 0; i--)
				{
					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
					{
						var row1 = row;
						var row2 = i;
						moveItem (row1, row2);
						setSelectedRow (row2);
						
						from = row1;
						to = row2;
						
						break;				
					}
					else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
					{
						break;
					}					
				}				
			}								
		}
	}	
	
	var result = new Array ();
	result[0] = from;
	result[1] = to;
	
	return result;			
}


// ------------------------------------
// moveItemDown
// ------------------------------------								
function functionMoveItemDown (row)
{
	if (!row)
	{
		row = _temp.selectedRow;
	}
	
	var from;
	var to;

	if (!_attributes.treeview)
	{
		if (row < (_elements.rows.length - 1))
		{
			moveItem (row, (row + 1));
			setSelectedRow ((row + 1));
			
			from = row;
			to = (row + 1);
		}
	}
	else
	{
		if (row < (_elements.rows.length - 1))
		{
			if (_elements.rows[(row + 1)].indentDepth == _elements.rows[row].indentDepth)
			{	
				console.log (getNumberOfRowChildren ((row + 1)))
			
				moveItem (row, (row + 1));				
				setSelectedRow (row + (getNumberOfRowChildren ((row + 1)) + 1));
				
				from = row;
				to = (row + 1);
			}
			else
			{
				from = row;				
			
				for (i = (row + 1); i < _elements.rows.length; i++)
				{									
					
				
					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
					{
						to = i;
						break;
					}
					else
					{						
						console.log (getNumberOfRowChildren (i))
					
						i = i + getNumberOfRowChildren (i);
						
					}				
				}
			
				
			
//				var row1 = row;
//				var row2 = null;
//				var row3 = null;															

//				for (i = (row + 1); i < _elements.rows.length; i++)
//				{
//					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
//					{	
//						if (row2 == null)
//						{
//							row2 = i;
//						}		
//						else
//						{
//							row3 = (i - row2);
//							break;
//						}						
//					}
//					else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
//					{
//						break;
//					}					
//				}				
				
//				if (row3 == null)
//				{
//					row3 = (row1 + 1);
//				}
				
//				if (row2 != null)
//				{					
					moveItem (from, to);
					setSelectedRow (from + 1);
//					
//					from = row1;
//					to = row3; 
//				}
			}				
		}
	}
	
	var result = new Array ();
	result[0] = from;
	result[1] = to;
	
	return result;
}






// ------------------------------------
// moveItemUp
// ------------------------------------						
function functionMoveItemUpOld (row)
{
	if (row == null)
	{
		row = _temp.selectedRow;
	}

	var from;
	var to;

	if (!_attributes.treeview)
	{
		if (row > 0)
		{
			moveItem (row, row - 1);
			setSelectedRow (row - 1);
			
			from = row;
			to = row -1;
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
				
				from = row;
				to = row - 1;

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
						
						from = row1;
						to = row2;
						
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
	
	var result = new Array ();
	result[0] = from;
	result[1] = to;
	
	return result;			
}

// ------------------------------------
// moveItemDown
// ------------------------------------								
function functionMoveItemDownOld (row)
{
	if (row == null)
	{
		row = _temp.selectedRow;
	}
	
	var from;
	var to;

	if (!_attributes.treeview)
	{
		if (row < _elements.rows.length - 1)
		{
			moveItem (row, row + 1);
			setSelectedRow (row + 1);
			
			from = row;
			to = row + 1;
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
				
				from = row;
				to = row + 1;
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
					
					from = row1;
					to = row3; 
				}
			}				
		}
	}
	
	var result = new Array ();
	result[0] = from;
	result[1] = to;
	
	return result;
}
	
function functionGetItemRow ()
{
	return _temp.selectedRow;

}