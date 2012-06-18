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
	var from;
	var to;
	var select;
	
	// If no row given, just use the currently selected one.
	if (!row )
	{		
		row = _temp.selectedRow;				
	}
	
	// Check if row is valid.
	if ((row >= _elements.rows.length) || (row == -1))
	{
		throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
	}
	
	// If row is not the first, than lets continue.
	if (row > 0)
	{		
		if (!_attributes.treeview)
		{			
			from = row;
			to = (row -1);
			select = (row - 1);
		}				
		else
		{
			// If row above is of same depth, just move up.	
			if (_elements.rows[(row - 1)].indentDepth == _elements.rows[row].indentDepth)
			{	
				from = row;
				to = (row - 1);
				select = (row - 1);
			}			
			else
			{
				// Figure out how many rows we need to move up before we hit a row on the same depth, if it exists.
				for (i = (row - 1); i >= 0; i--)
				{
					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
					{						
						from = row;
						to = i;
						select = i;
						
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
		
	// Move rows around, but only if eveything is ok.
	if ((from != null) && (to != null) && (select != null))
	{
		moveItem (from, to);
		setSelectedRow (select);
	}
	else
	{
		throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
	}
	
	// Create result.
	var result = new Array ();
	result[0] = from;
	result[1] = to;
	
	// All done.	
	return result;			
}

// ------------------------------------
// moveItemDown
// ------------------------------------								
function functionMoveItemDown (row)
{	
	var from;
	var to;
	var select;

	// If no row given, just use the currently selected one.
	if (!row)
	{
		row = _temp.selectedRow;
	}
	
	// Check if row is valid.
	if ((row >= _elements.rows.length) || (row == -1))
	{
		throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
	}
	
	// If row is not the last one, than lets continue.
	if (row < (_elements.rows.length - 1))
	{		
		if (!_attributes.treeview)
		{					
			from = row;
			to = (row + 1);
			select = (row + 1);
		}
		else
		{
			// If row below i of same depth, just move down.
			if (_elements.rows[(row + 1)].indentDepth == _elements.rows[row].indentDepth)
			{												
				from = row;
				to = (row + 1);
				select = row + (getNumberOfRowChildren ((row + 1)) + 1)
			}
			else
			{										
				// Figure out how many rows we need to move down before we hit a row of the same depth, if it exists.
				for (i = (row + 1); i < _elements.rows.length; i++)
				{																		
					if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
					{
						to = i;
						break;
					}
				}
								
				from = row;								
				select = (from + getNumberOfRowChildren (to) + 1)
			}				
		}
	}
	
	// Move rows around, but only if eveything is ok.
	if ((from != null) && (to != null) && (select != null))
	{
		moveItem (from, to);
		setSelectedRow (select);
	}
	else
	{
		throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
	}
	
	// Create result.
	var result = new Array ();
	result[0] = from;
	result[1] = to;
	
	// All done.
	return result;
}

// ------------------------------------
// getItemRow
// ------------------------------------		
function functionGetItemRow ()
{
	return _temp.selectedRow;

}