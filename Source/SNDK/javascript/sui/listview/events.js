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
