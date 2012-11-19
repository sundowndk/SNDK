// ------------------------------------
	// Events
	// ------------------------------------
	// ------------------------------------
	// eventOnKeyUp
	// ------------------------------------	
	function eventOnKeyUp (event)
	{
		keyHandler(event);
	}

	// ------------------------------------
	// eventOnKeyDown
	// ------------------------------------	
	function eventOnKeyDown (event)
	{
		keyHandler (event);
	}
		
	// ------------------------------------
	// eventOnEnter
	// ------------------------------------	
	function eventOnKeyPressEnter ()
	{	
		if (!attributes.disabled)
		{
			_attributes.active = true;
			refresh ();		
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
					setTimeout( function () { _attributes.onFocus (_attributes.name); }, 1);
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
					setTimeout( function () { _attributes.onBlur (_attributes.name); }, 1);
				}									
			}
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
	// onMouseDown
	// ------------------------------------		
	function eventOnMouseDown ()
	{
		if (!_attributes.disabled)
		{
			_attributes.focus = true;
			_temp.mouseDown = true;				
			refresh ();
		}
	}				
	
	// ------------------------------------
	// onMouseUp
	// ------------------------------------	
	function eventOnMouseUp ()
	{
		if (!_attributes.disabled)
		{
			if (_temp.mouseDown)
			{
				_temp.mouseDown = false;
				refresh ();
				
				eventOnClick ();
			}						
		}
	}
	
	// ------------------------------------
	// onClick
	// ------------------------------------	
	function eventOnClick ()
	{		
		if (_attributes.onClick != null)
		{
			setTimeout( function () { _attributes.onClick (_attributes.name); }, 1);
		}
	}
	
	// ------------------------------------
	// onDrag
	// ------------------------------------		
	function eventOnDrag ()
	{
		return false;
	}			