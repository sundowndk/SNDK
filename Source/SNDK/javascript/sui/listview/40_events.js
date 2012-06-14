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
		var row = this.id.split("_")[1];	
		var doubleclick = false;
									
		if (((SNDK.tools.getTicks () - _temp.doubleClickTicks) < 500) && (row == _temp.doubleClickRow) )
		{			
			_temp.doubleClickTicks = 0;
			doubleclick = true;
		}
		else
		{
			_temp.doubleClickTicks = SNDK.tools.getTicks ();
			_temp.doubleClickRow = row;
		}
		
		if ((row == _temp.selectedRow) && (doubleclick == false))
		{
			row = -1;
		}
		
		setSelectedRow (row)
		
		eventOnChange ();
									
		if (doubleclick)
		{
			if (_attributes.onDoubleClick != null)
			{
				setTimeout( function ()	{ _attributes.onDoubleClick (); }, 1);
			}							
		}
		else
		{
			if (_attributes.onClick != null)
			{
				setTimeout( function ()	{ _attributes.onClick (); }, 1);
			}							
		}
	}
}
			